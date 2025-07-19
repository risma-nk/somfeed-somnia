import axios from "axios";

export const uploadToPinata = async (file: File): Promise<string | null> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    console.error("Pinata JWT not found in environment variables.");
    return null;
  }
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(url, formData, {
      maxContentLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${
          (formData as any)._boundary
        }`,
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to Pinata: ", error);
    return null;
  }
};