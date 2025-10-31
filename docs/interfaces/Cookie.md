[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / Cookie

# Interface: Cookie

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:2

## Properties

### domain?

> `optional` **domain**: `string`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:19

Cookie domain.

***

### expires?

> `optional` **expires**: `number`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:39

Cookie expiration date, session cookie if not set

***

### httpOnly?

> `optional` **httpOnly**: `boolean`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:31

True if cookie is http-only.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:6

Cookie name.

***

### path?

> `optional` **path**: `string`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:23

Cookie path.

***

### priority?

> `optional` **priority**: `"Low"` \| `"Medium"` \| `"High"`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:43

Cookie Priority.

***

### sameParty?

> `optional` **sameParty**: `boolean`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:47

True if cookie is SameParty.

***

### sameSite?

> `optional` **sameSite**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:35

Cookie SameSite type.

***

### secure?

> `optional` **secure**: `boolean`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:27

True if cookie is secure.

***

### sourcePort?

> `optional` **sourcePort**: `number`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:57

Cookie source port. Valid values are `-1` or `1-65535`, `-1` indicates an unspecified port.
An unspecified port value allows protocol clients to emulate legacy cookie scope for the port.
This is a temporary ability and it will be removed in the future.

***

### sourceScheme?

> `optional` **sourceScheme**: `"Unset"` \| `"NonSecure"` \| `"Secure"`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:51

Cookie source scheme type.

***

### url?

> `optional` **url**: `string`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:15

The request-URI to associate with the setting of the cookie. This value can affect the
default domain, path, source port, and source scheme values of the created cookie.

***

### value

> **value**: `string`

Defined in: node\_modules/.pnpm/@crawlee+types@3.15.1/node\_modules/@crawlee/types/browser.d.ts:10

Cookie value.
