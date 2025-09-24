export const chatService = {
  async sendMessage(
    message: string,
    patientId?: string,
    selectedApi: string = "openai"
  ): Promise<{
    responses: Record<string, { answer: string; responseTime?: number }>;
  }> {
    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, patientId, selectedApi }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Backend error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Unknown error");
    }

    return {
      responses: data.data.responses,
    };
  },
};
