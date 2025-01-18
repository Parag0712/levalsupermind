import { client } from "@/lib/prisma";

export const fetchTranscriptions = async (userId: string) => {
    try {
      const transcriptions = await client.transcription.findMany({
        where: { userId },
      });
  
      return transcriptions || [];
    } catch (error) {
      console.error("Error fetching transcriptions:", error);
      throw new Error("Unable to fetch transcriptions");
    }
  };
      