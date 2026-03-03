export interface HttpErrorResponse {
    headers: {
      normalizedNames: Record<string, unknown>;
      lazyUpdate: any | null;
    };
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
    message: string;
    error: {
      Success: boolean;
      Titulo: string;
      Mensaje: string;
      Response: string;
    };
  }