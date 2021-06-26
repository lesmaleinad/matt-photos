import axios from 'axios';

export class Prodigi {
    constructor(private prodigiUrl: string, private apiKey: string) {}

    /**
     *
     * @param order An order parameter object.
     *
     * REQUIRED: shippingMethod, recepient, items
     *
     */
    public async createOrder(order: OrderParams): Promise<OrderOutcome> {
        return (
            await axios.post<OrderOutcome>(
                this.prodigiUrl + '/v4.0/Orders',
                order,
                {
                    headers: { 'X-API-Key': this.apiKey },
                }
            )
        ).data;
    }
}

export enum Outcome {
    Created = 'created',
    CreatedWithIssues = 'createdWithIssues',
    AlreadyExists = 'alreadyExists',
}

export enum ShippingMethod {
    Budget = 'Budget',
    Standard = 'Standard',
    Express = 'Express',
    Overnight = 'Overnight',
}

export enum DetailStage {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Complete = 'Complete',
    Error = 'Error',
}

export enum ItemSizing {
    FillPrintArea = 'fillPrintArea',
    FitPrintArea = 'fitPrintArea',
    StretchToPrintArea = 'stretchToPrintArea',
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
    attributes?: { [key: string]: string };
    packingSlip?: PackingSlip;
    metadata?: { [key: string]: string };
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

// const SANDBOX_ORDER_ENDPOINT = 'https://api.sandbox.prodigi.com';
// const TEST_API_KEY = 'test_7e56dea2-582d-479a-9d20-cf15a092bebf';
// new Prodigi(SANDBOX_ORDER_ENDPOINT, TEST_API_KEY)
//     .createOrder({
//         shippingMethod: ShippingMethod.Standard,
//         recipient: {
//             name: 'Daniel A',
//             address: {
//                 line1: '123 E 4 S',
//                 postalOrZipCode: '12345',
//                 townOrCity: 'Irvine',
//                 stateOrCounty: 'CA',
//                 countryCode: 'US',
//             },
//         },
//         items: [
//             {
//                 sku: 'GLOBAL-FAP-12X12',
//                 copies: 1,
//                 sizing: ItemSizing.FillPrintArea,
//                 assets: [
//                     {
//                         printArea: 'default',
//                         url:
//                             'https://static.wikia.nocookie.net/regularshowfanon/images/6/6a/Spongebob.jpg/revision/latest?cb=20170425224139',
//                     },
//                 ],
//             },
//         ],
//     })
//     .catch((e) => console.log(e.response.data.failures));
