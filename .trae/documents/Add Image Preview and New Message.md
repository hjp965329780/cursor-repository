I will implement the following changes to support image preview and add a new image message:

1.  **Add New Image Message**:
    -   Insert a new image message object into the `messages` array in `ChatWindow.vue`.

2.  **Implement In-App Image Preview (Lightbox)**:
    -   Create a full-screen overlay component within `ChatWindow.vue` to act as an image viewer.
    -   **Behavior**:
        -   Clicking an image in the chat will open it in this full-screen black overlay instead of a new browser tab.
        -   The image will be centered and scaled to fit the screen (zoom preview).
        -   Clicking anywhere on the preview overlay will close it.
    -   **Technical Changes**:
        -   Add `showPreview` (boolean) and `previewUrl` (string) to the component's `data`.
        -   Update `previewImage(src)` to set these data properties.
        -   Add the HTML template and CSS for the preview overlay.

This approach provides a much smoother, app-like experience compared to opening a new tab.
