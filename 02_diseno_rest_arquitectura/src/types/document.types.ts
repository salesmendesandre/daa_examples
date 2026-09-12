export interface DocumentItem {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
  author: string;
  tags?: string[];
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  tags?: string[];
}
