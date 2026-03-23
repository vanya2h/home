import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, noop } from "@tanstack/react-table";
import { useState } from "react";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui";
import { DataTable } from "./DataTable";

export type IPaginatedResponse<TData> = {
  cursor: string | null;
  data: TData[];
  hasNext: boolean;
};

export type IDataPaginatedTableProps<TData> = {
  queryKey: string;
  columns: ColumnDef<TData, any>[];
  fetchPage: (cursor: string | null, pageSize: number) => Promise<IPaginatedResponse<TData>>;
  pageSize?: number;
};

export function DataPaginatedTable<TData>({
  queryKey,
  columns,
  fetchPage,
  pageSize = 10,
}: IDataPaginatedTableProps<TData>) {
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const currentCursor = cursorStack[cursorStack.length - 1] ?? null;

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [queryKey, currentCursor],
    queryFn: () => fetchPage(currentCursor, pageSize),
  });

  if (isLoading) return <p className="text-indigo-200">Loading…</p>;
  if (isError || !data) return <p className="text-red-400">Error loading data.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest mintes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data.data} />
      </CardContent>
      <CardFooter>
        <PaginationControls
          isFetching={isFetching}
          canPrevious={cursorStack.length === 1}
          canNext={data.hasNext}
          onPrevious={() => setCursorStack((s) => s.slice(0, -1))}
          onNext={() => (data.cursor ? setCursorStack((s) => [...s, data.cursor]) : noop())}
        />
      </CardFooter>
    </Card>
  );
}

type IPaginationControlsProps = {
  canPrevious: boolean;
  canNext: boolean;
  isFetching: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function PaginationControls({ canPrevious, canNext, isFetching, onPrevious, onNext }: IPaginationControlsProps) {
  return (
    <div className="flex gap-2">
      <Button disabled={!canPrevious || isFetching} onClick={onPrevious}>
        Previous
      </Button>
      <Button disabled={!canNext || isFetching} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
