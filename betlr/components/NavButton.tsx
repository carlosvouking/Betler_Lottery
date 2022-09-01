import React from 'react'


interface Props {
    title: string;
    otherProp?: boolean;
    isActive?: boolean;
}


function NavButton({title, isActive}: Props) {
  return (
    <button className={`${isActive && "bg-[#414129]"} hover:bg-[#414129] text-white px-4 py-2 
              rounded font-bold`}> 
        {title}
    </button>
  )
}

export default NavButton