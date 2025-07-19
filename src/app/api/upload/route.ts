import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      console.error("PINATA_JWT is not set in environment variables.");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // Gunakan kembali formData yang diterima dari request
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          'Authorization': `Bearer ${pinataJwt}`,
        },
      }
    );
    const cid = response.data.IpfsHash;
    if (!cid) {
        return NextResponse.json({ error: "Could not retrieve CID from Pinata." }, { status: 500 });
    }

    return NextResponse.json({ success: true, cid });

  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json({ error: "Error uploading file." }, { status: 500 });
  }
}