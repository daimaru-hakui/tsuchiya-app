"use client";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase/client";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, CircleX, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  id: string;
};

export default function ProductShowImage({ id }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const formatName = format(new Date(), `yyyyMMdd_HHmmdd`);
    const fileName = formatName + "_" + file?.name;

    const imageRef = ref(storage, `images/${fileName}`);
    const fullPath = await uploadBytes(imageRef, file);

    const imageUrl = await getDownloadURL(
      ref(storage, fullPath.metadata.fullPath)
    );

    const productRef = doc(db, "products", id);
    updateDoc(productRef, {
      image: {
        url: imageUrl,
        path: fullPath.metadata.fullPath,
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="relative w-48">
      {file && (
        <div
          className="absolute right-[-10px] top-[-10px] z-50"
          onClick={() => setFile(null)}
        >
          <CircleX className="cursor-pointer bg-white rounded-full" />
        </div>
      )}
      {file ? (
        <Image
          width={300}
          height={300}
          src={window.URL.createObjectURL(file)}
          className="object-container w-[300px] h-[300px] md:w-48 md:h-48"
          alt=""
        />
      ) : (
        <label className="flex flex-col gap-3 w-48 h-48 justify-center items-center border border-gray-200 cursor-pointer ">
          <Upload size={36} />
          <p>画像をアップロード</p>
          <input
            type="file"
            name="file"
            hidden
            onChange={(e) => handleImage(e)}
          />
        </label>
      )}
      {file && (
        <Button type="submit" size="sm" className="w-full mt-2">
          アップロード
        </Button>
      )}
    </form>
  );
}
