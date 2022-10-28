import React from "react"

interface Props {
    title: string
    otherProp?: boolean
    isActive?: boolean
}

function NavButton({ title, isActive }: Props) {
    return (
        <button
            className={`${
                isActive && "bg-gradient-to-br from-yellow-300 to-stone-800 shadow-xl disabled:from-gray-500 disabled:to-gray-100 disabled:text-gray-100 disabled:cursor-not-allowed"
            } hover:bg-[#414129] text-white px-4 py-2 
              rounded font-bold `}
        >
            {title}
        </button>
    )
}

export default NavButton
