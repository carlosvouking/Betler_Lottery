// shortening the address

export const shortenAddress = (address) => ` ${address?.substring(0,6)}...${address?.substring(address.length, address.length - 4)} `


