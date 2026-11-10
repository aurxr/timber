import { useMemo } from 'react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Leads } from '../types/leads.types';

interface LeadTableProps {
  newLeads: Leads[];
}

export function LeadTable({ newLeads: leads }: LeadTableProps) {
  if (leads.length === 0) {
    return null;
  }
  if (leads.length!== 0) {
    const columns = useMemo<ColumnDef<Leads>[]>(() => [
    { header: "Organization", cell: (info) => info.renderValue(), accessorKey: "businessName" },
    { header: "Person", cell: (info) => info.renderValue(), accessorKey: "personOfContact" },
    { header: "Phone", cell: (info) => info.renderValue(), accessorKey: "number" },
    { header: "Email", cell: (info) => info.renderValue(), accessorKey: "email" },
    { header: "Address", cell: (info) => info.renderValue(), accessorKey: "mailingAddress" },
    { header: "City", cell: (info) => info.renderValue(), accessorKey: "city" },
    { header: "State", cell: (info) => info.renderValue(), accessorKey: "state" },
    { header: "Zip", cell: (info) => info.renderValue(), accessorKey: "zip" },
    { header: "Services", cell: (info) => info.renderValue(), accessorKey: "services" },
    { header: "Size", cell: (info) => info.renderValue(), accessorKey: "size" },
    { header: "Landowner", cell: (info) => info.renderValue(), accessorKey: "landowner" },
    { header: "Forestry Work", cell: (info) => info.renderValue(), accessorKey: "forestry" },
    { header: "Access to Timber", cell: (info) => info.renderValue(), accessorKey: "timberAccess" },
    { header: "Business Website", cell: (info) => info.renderValue(), accessorKey: "businessWebsite" }
  ], []); 

  const leadsTable = useReactTable({
    data:leads,
    columns:columns,
    getCoreRowModel:getCoreRowModel()
  });

  return (
    <section className="table-card">
      <div className="table-card-header">
        <h2>New Leads</h2>
        <span className="count-badge">{leads.length}</span>
      </div>
      <div className="table-wrap">
        <table>
            <thead>
                {leadsTable.getHeaderGroups().map((headerGroup)=>
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header)=>
                    <th colSpan={header.colSpan} key={header.id}>
                        {header.isPlaceholder? null:flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </th>)}

                </tr>)}
            </thead>
            <tbody>
                {leadsTable.getRowModel().rows.map((row)=>
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell)=>
                    <td key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </td>)}
                </tr>)}
            </tbody>

        </table>
      </div>
    </section>
  );
    
  }
}
export default LeadTable