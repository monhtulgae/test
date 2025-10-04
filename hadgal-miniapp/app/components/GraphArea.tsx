import { FaStar } from "react-icons/fa";
import PieChart from "./Chart";

type NumberProps = {
  amount: number;
}

export default function GraphArea({ amount }: NumberProps) {
  const dList = [
    {label: 'Лантуун Дохио ТББ', value: 44},
    {label: 'Өгөх гар хүүхдийн төв', value: 2},
    {label: 'Асралт гэр төв', value: 11},
    {label: 'Өнөр бүл хүүхдийн асрамжийн төв', value: 12},
    {label: 'Луугийн гэр ТББ', value: 0},
    {label: 'Magic Mongolia хүүхэд хамгааллын төв', value: 0},
  ]

  return (
    <div className=" my-2 bg-white p-3">
      <div className="mb-3">
        Энэ сард хандивласан: {amount}
      </div>
      <hr />
      <div>
        <p>Хандивласан төсөл</p>
        <PieChart data={dList}/>
      </div>
    </div>
  );
}