import { Stripe } from 'stripe';
import provideContextToRoot from '../contextFactory';
import { Storage, StorageKey } from '../localStorage/storage.service';

export interface CartItem {
    ['price']: Stripe.Price;
    ['quantity']: number;
}

class ShoppingCart {
    public items: CartItem[] = this.getInitialCartItems();

    private getInitialCartItems(): CartItem[] {
        return (Storage.get(StorageKey.CartItems)?.parse() ?? []) as CartItem[];
    }

    private updateStorage() {
        Storage.set(StorageKey.CartItems, JSON.stringify(this.items));
    }

    private getCartItemIndex(price: Stripe.Price): number {
        return this.items.findIndex(
            (cartItem) => cartItem['price']['id'] === price['id']
        );
    }

    public getCartItemByPrice(price: Stripe.Price): CartItem | undefined {
        return this.items[this.getCartItemIndex(price)];
    }

    public set(price: Stripe.Price, value: number) {
        const itemsCopy = this.items.slice();
        const cartItemIndex = this.getCartItemIndex(price);

        if (value > 0) {
            if (cartItemIndex > -1) {
                const cartItem = itemsCopy[cartItemIndex];
                cartItem.quantity = value;
            } else {
                itemsCopy.push({
                    ['price']: price,
                    ['quantity']: value,
                });
            }
        } else {
            itemsCopy.splice(cartItemIndex, 1);
        }

        this.items = itemsCopy;
        this.updateStorage();
    }
}

export const useCart = provideContextToRoot(new ShoppingCart());
