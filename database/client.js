import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'g8kwgm04',
  dataset: 'production',
  apiVersion: '2022-10-05',
  token: "skpjVrZTqzy7ucG8Yc8eUqsXhhcWNIzJqDmEr8bN5ZzmowzWbXrlXFMBPWP937oyffRkfQNxhhIUReQBaXahi4hfOP9C5DyMn9CMi4Q6kK0u3H5fFiL8hNTWt9GY37PxKqwUWLB4x7oiG27zqZ4bzc5INMfqpcELtqh9lORzKirkuifICJWN",
  useCdn: false,
});


/*
client.delete({
  query: `*[_type == "users"]`
}).then((res) => console.log('deleted all:',res))
*/



import { basename } from 'path';
import { createReadStream } from 'fs';

async function getData(query,params){
  return await client.fetch(query, params);
}

async function addData(doc){
  return await client.create(doc);
}

async function updateData(doc_id,new_doc){
  return await client.patch(doc_id).set(new_doc).commit();
}

async function uploadProfile(filePath,doc_id){
  console.log('file_path:', filePath);
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  var doc_info = await client.patch(doc_id).set({
      profile_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
  }).commit()
  return { ...doc_info,profile_image:imageAsset }
}

async function uploadImage(filePath){
  console.log('file_path:',filePath)
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  
  return { image:imageAsset }
}


async function clearDatabase(type){
    var r = await client.delete({ query: '*[_type=="'+type+'"]'});
    return r;
}

export {
  updateData,getData,addData,uploadProfile,uploadImage,clearDatabase
};