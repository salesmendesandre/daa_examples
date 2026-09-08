export interface DocumentItem {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export interface CreateDocumentDTO {
  title: string;
  content: string;
  author: string;
  tags?: string[];
}
