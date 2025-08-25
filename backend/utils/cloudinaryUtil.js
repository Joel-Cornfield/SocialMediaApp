const {Readable} = require("stream");
const cloudinary = require("../config/cloudinary");

async function uploadStream(buffer, folder, isVideo=false) {
  return new Promise((res, rej) => {
    const transformStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (err, result) => {
        if (err) return rej(err);
        res(result);
      }
    );
    // upload
    let str = Readable.from(buffer);
    str.pipe(transformStream);
  })
}

async function deleteFile(public_id) {
  result = await cloudinary.uploader.destroy(public_id);
}

module.exports = {uploadStream, deleteFile};