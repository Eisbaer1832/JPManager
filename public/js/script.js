$('#uploadVideoInput').click(function() {
  $(this).parents().find('#uploadVideoBtn').click();
});


async function uploadToWebDAV(serverUrl, username, password, remotePath, file) {
  const targetUrl = `${serverUrl.replace(/\/$/, '')}/${remotePath.replace(/^\//, '')}`;

  try {
    const response = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Authorization": "Basic " + btoa(`${username}:${password}`),
        "Content-Type": file.type || "application/octet-stream"
      },
      body: file
    });

    if (response.ok) {
      console.log("✅ File uploaded successfully!");
    } else {
      console.error("❌ Upload failed:", response.status, response.statusText);
    }
  } catch (err) {
    console.error("⚠️ Error uploading file:", err);
  }
}

// Example usage:
const serverUrl = "https://example.com/webdav"; 
const username = "myUser";
const password = "myPass";
const remotePath = "uploads/test.txt"; // Path on the WebDAV server

// For browser: file can be from an <input type="file">
// Example: const file = document.querySelector("input[type=file]").files[0];
const file = new Blob(["Hello WebDAV!"], { type: "text/plain" });

uploadToWebDAV(serverUrl, username, password, remotePath, file);
