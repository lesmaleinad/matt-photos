import { Stripe } from 'stripe';
import {
    provideStatefulContextToRoot,
    StatefulRootContext,
} from '../contextFactory';
import { Storage, StorageKey } from '../localStorage/storage.service';

export interface CartItem {
    ['price']: Stripe.Price;
    ['quantity']: number;
}

class ShoppingCart extends StatefulRootContext<CartItem[]> {
    public state: CartItem[] = this.getInitialCartItems();

    public get items(): CartItem[] {
        return this.state;
    }

    public set items(newItems: CartItem[]) {
        this.updateStorage(newItems);
        this.setState(newItems);
    }

    private getInitialCartItems(): CartItem[] {
        return (Storage.get(StorageKey.CartItems)?.parse() ?? []) as CartItem[];
    }

    public getTotalItems(): number {
        let total = 0;
        this.items.forEach((item) => (total += item.quantity));
        return total;
    }

    public getTotalPrice(): number {
        let total = 0;
        this.items.forEach(
            (item) =>
                (total += (item.price.unit_amount || 0 / 100) * item.quantity)
        );
        return total;
    }

    private updateStorage(items: CartItem[]) {
        Storage.set(StorageKey.CartItems, JSON.stringify(items));
    }

    private getCartItemIndex(price: Stripe.Price): number {
        return this.items.findIndex(
            (cartItem) => cartItem['price']['id'] === price['id']
        );
    }

    public getCartItemByPrice(price: Stripe.Price): CartItem | undefined {
        return this.items[this.getCartItemIndex(price)];
    }

    public add(price: Stripe.Price, amount: number = 1) {
        const cartItem = this.getCartItemByPrice(price);
        this.set(price, amount + (cartItem?.quantity || 0));
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
        } else if (cartItemIndex !== -1) {
            itemsCopy.splice(cartItemIndex, 1);
        }

        this.items = itemsCopy;
    }
}

export const useCart = provideStatefulContextToRoot<CartItem[], ShoppingCart>(
    new ShoppingCart()
);
