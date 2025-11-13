import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
import { Loader } from 'lucide-react';

const Uploadfile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token);

  const [isloading, setIsloading] = useState(false);
  const handleOnChange = (e) => {
    setIsloading(true);
    const files = e.target.files;
    if (files) {
      setIsloading(true);
      let allFiles = form.images;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not an image.`);
          continue;
        }
        //resize img
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            // endpoint Backend
            uploadFiles(token, data)
              .then((res) => {
                console.log(res);

                allFiles.push(res.data);

                setForm({
                  ...form,
                  images: allFiles,
                });
                setIsloading(false);
                toast.success("อัพโหลดรูปภาพสำเร็จ");
              })
              .catch((error) => {
                console.log(error);
                setIsloading(false);
              });
          },
          "base64"
        );
      }
    }
  };
  console.log(form);

  const handleDelete = (public_id) => {
    const images = form.images
    removeFiles(token,public_id)
    .then((res)=>{
        const filterImges = images.filter((item)=>{
            return item.public_id !== public_id
        })
        console.log(filterImges);
        setForm({
            ...form,
            images: filterImges
        })
        toast.error(res.data)
    })
    .catch((error)=>{
        console.log(error);
    })
  }
  return (
    <div className="my-4">
      <div className="flex flex-wrap gap-4 my-4">
        {isloading && (
          <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg">
            <Loader className="w-8 h-8 animate-spin text-blue-500"/>
          </div>
        )}
        
        {/* IMG */}
        {form.images.map((item, index) => (
          <div className="relative group" key={index}>
            <img 
              className="w-24 h-24 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200 border border-gray-200"
              src={item.url}
              alt={`Upload ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleDelete(item.public_id)}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Delete image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <input 
          onChange={handleOnChange} 
          type="file" 
          name="images" 
          multiple 
          accept="image/*"
          className="hidden"
          id="file-upload"
          disabled={isloading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center justify-center px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
            isloading
              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-500'
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-medium">
            {isloading ? 'Uploading...' : 'Choose Images or Drag & Drop'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default Uploadfile;
