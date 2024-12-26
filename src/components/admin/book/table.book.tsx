import { getBooksAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

type TSearch = {
    mainText: string;
    price: string;
    author: string;
    category: string;
    createdAt: string;
    createdAtRange: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <a
                        onClick={() => {
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên Sách',
            dataIndex: 'mainText',
        },
        {
            title: 'Thể Loại',
            dataIndex: 'category',
        },
        {
            title: 'Tác Giả',
            dataIndex: 'author',
        },
        {
            title: 'Giá Tiền',
            dataIndex: 'price',
        },

        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => alert(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        // okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>

                )
            }
        }

    ];

    // const refreshTable = () => {
    //     actionRef.current?.reload();
    // }

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.category) {
                            query += `&category=/${params.category}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    //default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        // setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

                headerTitle="Table book"
                toolBarRender={() => [

                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        {/* <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    > */}
                        Export
                        {/* </CSVLink> */}
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            // setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />

        </>
    );
};

export default TableBook;