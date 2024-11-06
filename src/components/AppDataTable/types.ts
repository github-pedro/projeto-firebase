type Align = 'start' | 'center' | 'end';

interface Header {
  align: Align;
  title: string;
  key: string;
  width?: string;
  sortable: boolean;
  col?: number;
}

export interface Paginacao {
  page: number;
  size: number;
  sort?: string[];
}

export type { Header, Align };
