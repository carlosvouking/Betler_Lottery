// shortening the address

export const shortenAddress = (address) => ` ${address?.substring(0,5)}...${address?.substring(address.length, address.length - 5)} `


