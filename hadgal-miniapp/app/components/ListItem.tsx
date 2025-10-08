// import "../global.css";
import { FaStar } from 'react-icons/fa';


export default function ListItem() {

  const dList = [
    {label: 'Лантуун Дохио ТББ', value: 44},
    {label: 'Өгөх гар хүүхдийн төв', value: 2},
    {label: 'Асралт гэр төв', value: 11},
    {label: 'Өнөр бүл хүүхдийн асрамжийн төв', value: 12},
    {label: 'Луугийн гэр ТББ', value: 0},
    {label: 'Magic Mongolia хүүхэд хамгааллын төв', value: 0},
  ]

  return (
    <div className="">
      <div className='mb-4 mx-3'>Нэг Тусал</div>
      <div></div>
      <ul className='mx-2'>
        {dList.map((item, index) => (
          <li key={index} className="flex bg-white mb-3 px-2 py-4 rounded-sm" >
            <div className="text-yellow-400 align-middle mx-2 flex items-center">
              <FaStar  />
            </div>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}