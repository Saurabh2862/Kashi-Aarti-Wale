import { v2 as cloudinary } from 'cloudinary';
for (const key of ['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']) if (!process.env[key]) throw new Error(`${key} is required`);
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
try {
  await cloudinary.api.ping();
  const presets = [
    { name: 'kaw_image_v1', allowed_formats: ['jpg','jpeg','png','webp'], max_file_size: 3*1024*1024 },
    { name: 'kaw_review_video_v1', allowed_formats: ['mp4','webm'], max_file_size: 20*1024*1024 },
    { name: 'kaw_gallery_video_v1', allowed_formats: ['mp4','webm'], max_file_size: 50*1024*1024 },
  ];
  for (const {name,...options} of presets) {
    const settings={...options,unsigned:false,type:'authenticated',overwrite:false};
    try { await cloudinary.api.upload_preset(name); await cloudinary.api.update_upload_preset(name,settings); }
    catch (error) { if (error?.error?.http_code!==404 && error?.http_code!==404) throw error; await cloudinary.api.create_upload_preset({name,...settings}); }
    console.log(`Configured restricted signed-upload preset: ${name}`);
  }
} catch(error) { console.error('Cloudinary setup failed. Check the credentials and account permissions. HTTP status:',error?.error?.http_code||error?.http_code||'unknown'); process.exitCode=1; }
