export declare class Prodigi {
    private prodigiUrl;
    private apiKey;
    constructor(prodigiUrl: string, apiKey: string);
    /**
     *
     * @param order An order parameter object.
     *
     * REQUIRED: shippingMethod, recepient, items
     *
     */
    createOrder(order: OrderParams): Promise<OrderOutcome>;
}
export declare enum Outcome {
    Created = "created",
    CreatedWithIssues = "createdWithIssues",
    AlreadyExists = "alreadyExists"
}
export declare enum ShippingMethod {
    Budget = "Budget",
    Standard = "Standard",
    Express = "Express",
    Overnight = "Overnight"
}
export declare enum DetailStage {
    NotStarted = "NotStarted",
    InProgress = "InProgress",
    Complete = "Complete",
    Error = "Error"
}
export declare enum ItemSizing {
    FillPrintArea = "fillPrintArea",
    FitPrintArea = "fitPrintArea",
    StretchToPrintArea = "stretchToPrintArea"
}
interface Status {
    stage: string;
    issues: {
        objectId: string;
        errorCode: string;
        description: string;
        authorizationDetails: any;
    }[];
    details: {
        downloadAssets: DetailStage;
        allocateProductionLocation: DetailStage;
        printReadyAssetsPrepared: DetailStage;
        inProduction: DetailStage;
        shipping: DetailStage;
    };
}
interface Recipient {
    name: string;
    email?: string;
    phoneNumber?: string;
    address: {
        line1: string;
        line2?: string;
        postalOrZipCode: string;
        countryCode: string;
        townOrCity: string;
        stateOrCounty?: string;
    };
}
interface Cost {
    amount: string;
    currency: string;
}
interface Asset {
    printArea: string;
    url: string;
}
interface PackingSlip {
    url?: string;
    status?: string;
}
interface ItemParams {
    merchantReference?: string;
    sku: string;
    copies: number;
    sizing: ItemSizing;
    assets: Asset[];
}
export interface OrderParams {
    callbackUrl?: string;
    merchantReference?: string;
    shippingMethod: ShippingMethod;
    idempotencyKey?: string;
    recipient: Recipient;
    items: ItemParams[];
    recipientCost?: Cost;
    attributes?: {
        [key: string]: string;
    };
    packingSlip?: PackingSlip;
    metadata?: {
        [key: string]: string;
    };
}
interface Order extends OrderParams {
    id: string;
    created: string;
    status: Status;
}
interface OrderOutcome {
    outcome: Outcome;
    order: Order;
    charges: any[];
    shipments: any[];
}
export {};
