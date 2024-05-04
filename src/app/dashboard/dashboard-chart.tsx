"use client";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: "3月",
    this: 82,
    last: 44,
  },
  {
    name: "4月",
    this: 80,
    last: 40,
  },
  {
    name: "5月",
    this: 83,
    last: 42,
  },
  {
    name: "6月",
    this: 50,
    last: 50,
  },
  {
    name: "7月",
    this: 40,
    last: 60,
  },
  {
    name: "8月",
    this: 60,
    last: 40,
  },
  {
    name: "9月",
    this: 55,
    last: 55,
  },
  {
    name: "10月",
    this: 49,
    last: 61,
  },
  {
    name: "11月",
    this: 44,
    last: 70,
  },
  {
    name: "12月",
    this: 40,
    last: 40,
  },
  {
    name: "1月",
    this: 50,
    last: 50,
  },
  {
    name: "2月",
    this: 50,
    last: 30,
  },
];

export default function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        className='[&_.recharts-tooltip-cursor]:fill-zinc-200
        dark:[&_.recharts-tooltip-cursor]:fill-zinc-800'
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          labelClassName='dark:text-muted'
          wrapperClassName='rounded-md'
          separator=' : '
          formatter={(value, name) => {
            if (name === 'this') {
              return [value, "本年実績"];
            } else if (name === 'last') {
              return [value, "前年実績"];
            }
          }}
        />
        <Legend formatter={(value) => {
          if (value === "this") {
            return <div>本年実績</div>;
          } else if (value === "last") {
            return <div>前年実績</div>;
          }
        }} />
        <Bar dataKey="last" stackId={1} fill="#1da850" radius={[2, 2, 0, 0]} />
        <Bar dataKey="this" stackId={2} fill="#3d5adb" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}