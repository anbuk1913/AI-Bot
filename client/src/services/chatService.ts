export const chatService = {
  async sendMessage(message: string, patientId?: string, sessionId?: string): Promise<{ response: string; sessionId: string }> {
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, patientId, sessionId })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Backend error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    return {
      response: data.data.response,
      sessionId: data.data.sessionId
    };
  }
};