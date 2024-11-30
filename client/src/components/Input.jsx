export default function Input({placeholder, name, type,value, handleChange}){
    return(
        <input type="text" placeholder={placeholder} type={type} step="0.0001" value={value} onChange={(e)=> handleChange(e,name)}
            className="my-2 rounded-sm w-full p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
    );
}