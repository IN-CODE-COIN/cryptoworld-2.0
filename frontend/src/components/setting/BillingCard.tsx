import React from "react";
import { Table, Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

export const BillingCard: React.FC = () => {
  const dataSource = [
    {
      key: "1",
      provider: "MasterCard",
      status: "Active",
      type: "Credit",
      number: "1234",
      expDate: "1/2028",
    },
  ];

  const columns = [
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <div className="flex items-center">
          <CheckCircleFilled className="text-emerald-500 mr-2" />
          {status}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Number (Last 4)",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Exp. Date",
      dataIndex: "expDate",
      key: "expDate",
    },
    {
      title: "Edit",
      key: "edit",
      render: () => (
        <a href="#" className="font-medium text-blue-500 hover:text-blue-700">
          Edit
        </a>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment method
          </h4>
          <p className="mt-2 text-gray-500">
            Payments will be taken from the card listed below, and you can
            update it by adding a new card through the menu on the right.
          </p>
        </div>
        <Button
          type="primary"
          className="whitespace-nowrap rounded bg-blue-500 px-3 py-2 font-medium text-white shadow hover:bg-blue-700 flex max-w-max"
        >
          Add new card
        </Button>
      </div>
      <div className="mt-6">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};
