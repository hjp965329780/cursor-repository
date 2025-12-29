<template>
  <div class="wechat-container">
    <header class="header">
      <div class="back-btn">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </div>
      <div class="title">文件传输助手</div>
      <div class="menu-btn">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </div>
    </header>

    <div class="message-list" ref="messageList">
      <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.isMe ? 'me' : 'other']">
        <div class="avatar">
          <img v-if="msg.isMe" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Me" />
          <img v-else src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Other" />
        </div>
        
        <div class="message-content">
          <div v-if="msg.type === 'text'" class="bubble text">
            {{ msg.content }}
          </div>
          
          <div v-else-if="msg.type === 'image'" class="bubble image">
            <img :src="msg.content" @click="previewImage(msg.content)" />
          </div>
          
          <div v-else-if="msg.type === 'voice'" class="bubble voice" @click="playVoice(msg)">
            <span class="voice-icon" :class="{ playing: msg.isPlaying }">
              <svg v-if="!msg.isMe" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path class="voice-wave-1" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 0 ? 0.3 : 1 }" d="M12 12c0-1.66-1.34-3-3-3v6c1.66 0 3-1.34 3-3z"/>
                <path class="voice-wave-2" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 1 ? 0.3 : 1 }" d="M14.83 7.76L13.41 9.17c1.56 1.56 1.56 4.09 0 5.66l1.41 1.41c2.34-2.34 2.34-6.14 0-8.48z"/>
                <path class="voice-wave-3" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 2 ? 0.3 : 1 }" d="M17.66 4.93L16.24 6.34c3.12 3.12 3.12 8.19 0 11.31l1.41 1.41c3.9-3.9 3.9-10.23 0-14.13z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="transform: rotate(180deg);">
                <path class="voice-wave-1" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 0 ? 0.3 : 1 }" d="M12 12c0-1.66-1.34-3-3-3v6c1.66 0 3-1.34 3-3z"/>
                <path class="voice-wave-2" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 1 ? 0.3 : 1 }" d="M14.83 7.76L13.41 9.17c1.56 1.56 1.56 4.09 0 5.66l1.41 1.41c2.34-2.34 2.34-6.14 0-8.48z"/>
                <path class="voice-wave-3" :style="{ opacity: msg.isPlaying && msg.voiceState % 3 === 2 ? 0.3 : 1 }" d="M17.66 4.93L16.24 6.34c3.12 3.12 3.12 8.19 0 11.31l1.41 1.41c3.9-3.9 3.9-10.23 0-14.13z"/>
              </svg>
            </span>
            <span class="duration">{{ msg.duration }}''</span>
          </div>
          
          <div v-else-if="msg.type === 'video'" class="bubble video">
            <video :src="msg.content" controls></video>
          </div>
          
          <div v-else-if="msg.type === 'file'" class="bubble file" @click="openFile(msg)">
            <div class="file-info">
              <div class="file-name">{{ msg.fileName }}</div>
              <div class="file-size">{{ msg.fileSize }}</div>
            </div>
            <div class="file-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="#999">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="voice-btn-icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#333"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
      </div>
      <input 
        type="text" 
        v-model="inputMessage" 
        @keyup.enter="sendText" 
        class="input-box"
        placeholder="发送消息..."
      />
      <div class="emoji-btn-icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#333"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
      </div>
      <div class="plus-btn-icon" @click="showMore = !showMore">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#333"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
      </div>
    </div>

    <div class="more-panel" v-if="showMore">
      <div class="tool-item" @click="sendMockImage">
        <div class="tool-icon">🖼️</div>
        <div class="tool-name">照片</div>
      </div>
      <div class="tool-item" @click="sendMockVideo">
        <div class="tool-icon">📹</div>
        <div class="tool-name">拍摄</div>
      </div>
      <div class="tool-item" @click="sendMockFile">
        <div class="tool-icon">📁</div>
        <div class="tool-name">文件</div>
      </div>
      <div class="tool-item" @click="sendMockVoice">
        <div class="tool-icon">🎤</div>
        <div class="tool-name">语音</div>
      </div>
    </div>

    <!-- Image Preview Overlay -->
    <div class="image-preview-overlay" v-if="showPreview" @click="closePreview">
      <img :src="previewUrl" alt="Preview" @click.stop />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  data() {
    return {
      inputMessage: '',
      showMore: false,
      showPreview: false,
      previewUrl: '',
      messages: [
        {
          id: 1,
          type: 'text',
          content: '你好，请问微信聊天页面怎么做？',
          isMe: false
        },
        {
          id: 2,
          type: 'text',
          content: '我们可以使用 Vue 来实现，支持多种消息类型。',
          isMe: true
        },
        {
          id: 3,
          type: 'image',
          content: 'https://picsum.photos/300/200',
          isMe: false
        },
        {
          id: 4,
          type: 'voice',
          duration: 12,
          isPlaying: false,
          isMe: true
        },
        {
          id: 5,
          type: 'file',
          fileName: '需求文档.pdf',
          fileSize: '2.5 MB',
          isMe: false
        },
        {
            id: 6,
            type: 'video',
            content: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isMe: true
        },
        {
          id: 7,
          type: 'image',
          content: 'https://picsum.photos/300/200?random=999',
          isMe: true
        },
        {
          id: 8,
          type: 'image',
          content: 'https://picsum.photos/300/200?random=888',
          isMe: false
        },
        {
          id: 9,
          type: 'image',
          content: 'https://picsum.photos/300/200?random=777',
          isMe: true
        }
      ]
    }
  },
  methods: {
    sendText() {
      if (!this.inputMessage.trim()) return;
      this.messages.push({
        id: Date.now(),
        type: 'text',
        content: this.inputMessage,
        isMe: true
      });
      this.inputMessage = '';
      this.scrollToBottom();
    },
    sendMockImage() {
      this.messages.push({
        id: Date.now(),
        type: 'image',
        content: `https://picsum.photos/300/200?random=${Date.now()}`,
        isMe: true
      });
      this.showMore = false;
      this.scrollToBottom();
    },
    sendMockVideo() {
        this.messages.push({
        id: Date.now(),
        type: 'video',
        content: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isMe: true
      });
      this.showMore = false;
      this.scrollToBottom();
    },
    sendMockFile() {
         this.messages.push({
        id: Date.now(),
        type: 'file',
        fileName: '新建文件.zip',
        fileSize: '10.2 MB',
        isMe: true
      });
      this.showMore = false;
      this.scrollToBottom();
    },
    sendMockVoice() {
        this.messages.push({
        id: Date.now(),
        type: 'voice',
        duration: Math.floor(Math.random() * 60) + 1,
        isPlaying: false,
        isMe: true
      });
      this.showMore = false;
      this.scrollToBottom();
    },
    playVoice(msg) {
      // 1. Stop if currently playing this message
      if (msg.isPlaying) {
        this.stopVoice(msg);
        return;
      }
      
      // 2. Stop any other playing messages
      this.messages.forEach(m => {
        if (m.type === 'voice' && m.isPlaying) {
          this.stopVoice(m);
        }
      });

      // 3. Start playing
      this.$set(msg, 'isPlaying', true);
      this.$set(msg, 'voiceState', 0);
      
      // Animation Interval
      msg.animationInterval = setInterval(() => {
        const nextState = (msg.voiceState + 1) % 3;
        this.$set(msg, 'voiceState', nextState);
      }, 500);

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
           alert('浏览器不支持音频播放');
           this.stopVoice(msg);
           return;
        }

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // 440Hz tone
        
        // Volume
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

        oscillator.start();
        
        msg.audioCtx = ctx;
        msg.oscillator = oscillator;

        // Auto stop after duration (mocking length)
        // Use msg.duration but cap it for preview
        const duration = (msg.duration || 3); 
        // Play for the duration of the message or max 3 seconds for demo
        const playDuration = Math.min(duration, 3) * 1000;

        msg.stopTimer = setTimeout(() => {
            this.stopVoice(msg);
        }, playDuration);

      } catch (e) {
        console.error('Audio play error', e);
        this.stopVoice(msg);
        alert('播放出错');
      }
    },
    stopVoice(msg) {
        this.$set(msg, 'isPlaying', false);
        this.$set(msg, 'voiceState', 2); // Reset to full waves

        if (msg.animationInterval) {
            clearInterval(msg.animationInterval);
            msg.animationInterval = null;
        }

        if (msg.oscillator) {
            try {
                msg.oscillator.stop();
            } catch(e) {}
            msg.oscillator = null;
        }
        if (msg.audioCtx) {
            try {
                msg.audioCtx.close();
            } catch(e) {}
            msg.audioCtx = null;
        }
        if (msg.stopTimer) {
            clearTimeout(msg.stopTimer);
            msg.stopTimer = null;
        }
        // Cleanup legacy audio object if exists from previous versions
        if (msg.audio) {
            msg.audio.pause();
            msg.audio = null;
        }
    },
    openFile(msg) {
      // Create a dummy file content
      const content = "This is a sample file content for " + msg.fileName;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = msg.fileName || 'download.txt'; // Force download with filename
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    previewImage(src) {
      this.previewUrl = src;
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      this.previewUrl = '';
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const list = this.$refs.messageList;
        list.scrollTop = list.scrollHeight;
      });
    }
  },
  mounted() {
    this.scrollToBottom();
  }
}
</script>

<style scoped>
.wechat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ededed;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
  height: 44px;
  background-color: #ededed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid #dcdcdc;
  flex-shrink: 0;
}

.header .title {
  font-weight: 500;
  font-size: 17px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 80%;
}

.message-row.me {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.other {
  align-self: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.bubble {
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.4;
  position: relative;
  word-wrap: break-word;
}

/* Text Bubble Styles */
.message-row.other .bubble.text {
  background-color: #ffffff;
  border: 1px solid #ededed;
}

.message-row.me .bubble.text {
  background-color: #95ec69;
  border: 1px solid #8ad961;
}

/* Image Bubble Styles */
.bubble.image {
  padding: 0;
  background: transparent;
  border: none;
}
.bubble.image img {
  max-width: 200px;
  border-radius: 4px;
  display: block;
}

/* Voice Bubble Styles */
.bubble.voice {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
  cursor: pointer;
}
.message-row.other .bubble.voice {
  background-color: #fff;
}
.message-row.me .bubble.voice {
  background-color: #95ec69;
  flex-direction: row-reverse;
}

/* Video Bubble Styles */
.bubble.video {
  padding: 0;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
}
.bubble.video video {
  max-width: 240px;
  display: block;
}

/* File Bubble Styles */
.bubble.file {
  background-color: #fff;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 240px;
  border: 1px solid #ededed;
}
.message-row.me .bubble.file {
  background-color: #fff; /* Files are usually white even if sent by me in WeChat? Actually yes, often white bubble */
  border-color: #ededed; 
}
.file-info {
  flex: 1;
  overflow: hidden;
}
.file-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}
.file-size {
  font-size: 12px;
  color: #999;
}

/* Footer Styles */
.footer {
  background-color: #f7f7f7;
  border-top: 1px solid #dcdcdc;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  flex-shrink: 0;
}

.input-box {
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 16px;
  outline: none;
}

.voice-btn-icon, .emoji-btn-icon, .plus-btn-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* More Panel */
.more-panel {
  height: 200px;
  background-color: #f7f7f7;
  border-top: 1px solid #dcdcdc;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.tool-icon {
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 1px solid #e5e5e5;
}

.tool-name {
  font-size: 12px;
  color: #666;
}

/* Image Preview Overlay */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.image-preview-overlay img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: default;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
</style>
