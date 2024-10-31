import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { storage } from "@/firebase/firebaseConfig";
import { updateDocument } from "@/api/firebase/master/firestoreCrud";
import { USER_COLLECTION } from "@/constants/collections";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiPencilFill } from "react-icons/ri";
import { useLocalStorage } from "usehooks-ts";

export default function EditProfile({ onClick, accountId }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false); // For handling upload state
  const [user, setUser] = useLocalStorage("user", null);
  const [imageURL, setImageURL] = useState(user?.profileImage || "/user.png");
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should be less than 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      setError(""); // Clear previous errors
      setImage(file);
      // Create a temporary URL for previewing the image
      setPreviewImageURL(URL.createObjectURL(file));
    }
  };

  const handleChangePhoto = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setUploading(true);
    const imageRef = ref(storage, `profileImages/${accountId}`);
    try {
      // Upload image to Firebase Storage
      await uploadBytes(imageRef, image);
      // Get the image's download URL
      const downloadURL = await getDownloadURL(imageRef);
      setImageURL(downloadURL);

      const updateData = {
        profileImage: downloadURL,
      };

      // Store the URL in Firestore under the user's document
      await updateDocument(USER_COLLECTION, user.id, updateData);
      setUser({
        ...user,
        profileImage: downloadURL,
      });

    setImage(null);

      // //console.log("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image: ", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Clean up the temporary preview URL
      if (previewImageURL) {
        URL.revokeObjectURL(previewImageURL);
      }
    }
  };

  const handleCloseDialog = () => {
    // Revert the preview image to the original if the dialog is closed
    setPreviewImageURL(null);
    setImage(null);
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Edit Profile"
          className="p-2"
          onClick={onClick}
        >
          <RiPencilFill className="text-newSecondary bg-transparent" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  text-[32px] bg-[#111922] shadow-md text-white ">
        <DialogHeader>
          <DialogTitle className="text-newSecondary rounded-full">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className="grid grid-cols-4 items-center gap-4"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="relative flex-shrink-0 w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] bg-gray-300 rounded-lg overflow-hidden">
              <img
                src={previewImageURL || imageURL || "/user.png"} // Shorter and clearer fallback check
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-1 right-1 w-4 h-4 bg-transparent flex items-center justify-center">
                <Button
                  variant="ghost"
                  aria-label="Edit Profile"
                  className="p-2"
                  onClick={() => document.getElementById("upload-photo").click()}
                >
                  <RiPencilFill className="text-newSecondary" />
                </Button>
              </div>
            </div>

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="upload-photo" // Match this with the label's htmlFor
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="walletAddress"
              className="text-right text-newSecondary font-bold"
            >
              Wallet Address
            </Label>
            <Input
              id="walletAddress"
              defaultValue={accountId}
              className="col-span-3 text-white font-bold"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="username"
              className="text-right text-newSecondary font-bold"
            >
              Username
            </Label>
            <Input
              id="username"
              defaultValue={"@" + accountId.replace(".testnet", "")}
              className="col-span-3 text-white font-bold"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          {image && (
            <Button
              type="button"
              onClick={handleChangePhoto}
              disabled={uploading}
              className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full w-fit hover:scale-[1.1]"
              aria-label="Upload Photo"
            >
              {uploading ? "Uploading..." : "Upload & Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
