export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}
export interface Users {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    company: string;
    profession: string;
    userType: string;
    date: string;
}
export interface Notification {
    id: string;
    fullname: string;
    subject: string;
    topic: string;
    email: string;
    textmessage: string;
    date: string;
    status: number;
}
export interface SmallProduct {
    reference: string;
    oldprice: number;
}
export interface Promotion {
    id: string;
    event: string;
    status: number;
    products: SmallProduct[];
    eventLenght: number;
    eventCategory: string;
    submmitedBy: string;
    date: string;
}
