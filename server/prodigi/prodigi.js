"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemSizing = exports.DetailStage = exports.ShippingMethod = exports.Outcome = exports.Prodigi = void 0;
var axios_1 = __importDefault(require("axios"));
var Prodigi = /** @class */ (function () {
    function Prodigi(prodigiUrl, apiKey) {
        this.prodigiUrl = prodigiUrl;
        this.apiKey = apiKey;
    }
    /**
     *
     * @param order An order parameter object.
     *
     * REQUIRED: shippingMethod, recepient, items
     *
     */
    Prodigi.prototype.createOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post(this.prodigiUrl + '/v4.0/Orders', order, {
                            headers: { 'X-API-Key': this.apiKey },
                        })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    return Prodigi;
}());
exports.Prodigi = Prodigi;
var Outcome;
(function (Outcome) {
    Outcome["Created"] = "created";
    Outcome["CreatedWithIssues"] = "createdWithIssues";
    Outcome["AlreadyExists"] = "alreadyExists";
})(Outcome = exports.Outcome || (exports.Outcome = {}));
var ShippingMethod;
(function (ShippingMethod) {
    ShippingMethod["Budget"] = "Budget";
    ShippingMethod["Standard"] = "Standard";
    ShippingMethod["Express"] = "Express";
    ShippingMethod["Overnight"] = "Overnight";
})(ShippingMethod = exports.ShippingMethod || (exports.ShippingMethod = {}));
var DetailStage;
(function (DetailStage) {
    DetailStage["NotStarted"] = "NotStarted";
    DetailStage["InProgress"] = "InProgress";
    DetailStage["Complete"] = "Complete";
    DetailStage["Error"] = "Error";
})(DetailStage = exports.DetailStage || (exports.DetailStage = {}));
var ItemSizing;
(function (ItemSizing) {
    ItemSizing["FillPrintArea"] = "fillPrintArea";
    ItemSizing["FitPrintArea"] = "fitPrintArea";
    ItemSizing["StretchToPrintArea"] = "stretchToPrintArea";
})(ItemSizing = exports.ItemSizing || (exports.ItemSizing = {}));
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
