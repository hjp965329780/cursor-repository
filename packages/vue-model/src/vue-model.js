let _Vue = null;

const allModelManagers = new Map();
const models = new Map();

class ModelManager {
    constructor(Ctr, ...args) {
        this.Ctr = Ctr;
        this.ctrArguments = args;
        this.entity = null;
        this._refCount = 0;
    }
    init(route) {
        if (!_Vue) {
            throw new TypeError('please install plugin first');
        }
        let entity = this.entity;
        if (entity) {
            return;
        }
        entity = new this.Ctr(...this.ctrArguments);
        /**
         * 此处调用只保证Ctr中声明的属性是响应的，
         * 如果后续在entity上增加响应式属性，需手动调用Vue.set
         */
        _Vue.util.defineReactive(this, 'entity', entity);
        models.set(this.Ctr, entity);
        return entity.init && entity.init(route);
    }
    addRef($route = {}) {
        if (this._refCount === 0) {
            this.init($route);
        }
        this._refCount++;
    }
    removeRef() {
        this._refCount--;
        if (this._refCount <= 0) {
            const entity = this.entity;
            delete this.entity;
            models.delete(this.Ctr);
            entity.destroy && entity.destroy();
            this._refCount = 0;
        }
    }
}

/**
 * 创建一个可自动清理的model，
 * 使用_refCount记录被组件引用的次数，在组件beforeCreate、beforeDestroy阶段更新_refCount
 *  _refCount从0到1，会用Ctr创建一个新的entity，并且尝试调用 entity.init
 *  _refCount从1到0，则销毁entity，并尝试调用 entity.destroy
 * @param {function} Ctr 用于创建entity实例
 * @param args 其他可选参数，创建entity实例时传给Ctr
 * @returns {{entity: null, _refCount: number, init(*=): Promise<undefined>, addRef(): void, removeRef(): void, swap(*=): void}}
 */
function createModel(Ctr, ...args) {
    return new ModelManager(Ctr, ...args);
}

// 支持两种model定义，class和数组（第一个元素为class）
function normalizeModelDefinition(modelDefinition) {
    if (typeof modelDefinition === 'function') {
        return {
            modelCtr: modelDefinition,
            modelCtrArguments: []
        };
    }
    if (Array.isArray(modelDefinition) && typeof modelDefinition[0] === 'function') {
        return {
            modelCtr: modelDefinition[0],
            modelCtrArguments: modelDefinition.slice(1)
        }
    }
    throw new Error('invalid model definition');
}

function processModelsConfig(config = {}, iterate) {
    return Object.entries(config).map(([key, modelDefination]) => {
        // Deprecated: 兼容调用createModel的创建方式
        if (modelDefination instanceof ModelManager) {
            return iterate(modelDefination, key);
        }

        const {modelCtr, modelCtrArguments} = normalizeModelDefinition(modelDefination);

        if (allModelManagers.has(modelCtr)) {
            return iterate(allModelManagers.get(modelCtr), key);
        }
        const modelManager = new ModelManager(modelCtr, ...modelCtrArguments);
        allModelManagers.set(modelCtr, modelManager);
        return iterate(modelManager, key);
    });
}

function resolveModels(component) {
    // Deprecated, 使用vue-class-component，class方式定义vue组件会将models放到Ctor.options，后续完善获取方式
    return component && (
        component.models || component.options && component.options.models
    )
}

function routerPlugin(router) {
    router.beforeResolve(async (to, from, next) => {
        const matchedList = router.getMatchedComponents(to).filter(resolveModels);
        // TODO: 处理ssr
        if (!matchedList.length) {
            next();
            return;
        }
        await Promise.all(matchedList.reduce((promises, component) => {
            promises.push(...processModelsConfig(resolveModels(component), modelManager => modelManager.init(to)));
            return promises;
        }, []));
        next();
    });
}

const plugin = {
    install(Vue) {
        if (_Vue && _Vue === Vue) {
            return;
        }
        _Vue = Vue;
        Vue.prototype.$models = models;
        Vue.mixin({
            beforeCreate() {
                const models = {};
                processModelsConfig(this.$options.models, (modelManager, key) => {
                    modelManager.addRef(this.$route);
                    this[key] = models[key] = modelManager.entity;
                });
                const data = typeof this.$options.data === 'function' ?  this.$options.data : () => data || {};
                const originalData = data.__originalData__ || data;
                const newData = function () {
                    const result = originalData.call(this);
                    return {
                        ...result,
                        ...models
                    }
                };
                newData.__originalData__ = originalData;
                this.$options.data = newData;
            },
            beforeDestroy() {
                processModelsConfig(this.$options.models, (modelManager, key) => {
                    modelManager.removeRef();
                });
            }
        });
    }
};


export default {
    createModel,
    routerPlugin,
    plugin,
    models
}