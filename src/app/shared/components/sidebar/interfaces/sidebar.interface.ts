export interface ListGroup{
    title: string;
    name: string;
    items: ListGroupItem[];
}

export interface ListGroupItem{
    name: string;
    path: string;
    icon: string;
}