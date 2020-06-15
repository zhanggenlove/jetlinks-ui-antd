import { Drawer, Button, Table, Select } from "antd";
import React, { useState, useEffect, Fragment } from "react";
import Service from "@/pages/system/tenant/service";
import { ListData } from "@/services/response";
import encodeQueryParam from "@/utils/encodeParam";
import SearchForm from "@/components/SearchForm";
import Add from "./add";
import User from "./user";

interface Props {
    close: Function;
    data: any;
}
const Edit = (props: Props) => {
    const service = new Service('tenant');

    const [list, setList] = useState<ListData<any>>();
    const [add, setAdd] = useState<boolean>(false);
    const [cat, setCat] = useState<boolean>(false);
    const [asset, setAsset] = useState();
    const { data } = props;
    useEffect(() => {
        console.log(data, 'dddd');
        service.assets.product(encodeQueryParam({
            terms: {
                id$assets: JSON.stringify({
                    tenantId: data?.id,
                    assetType: 'product',
                    // not: true,
                })
            }
        })).subscribe(resp => {
            setList(resp);
        })
    }, []);
    const rowSelection = {
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            console.log(selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        }, {
            title: '名称',
            dataIndex: 'name'
        }, {
            title: '操作',
            render: (_: string, record: any) => (
                <Fragment>
                    <a onClick={() => {
                        setAsset(record);
                        setCat(true);
                    }}>查看</a>
                </Fragment>
            )
        }]

    return (
        <Drawer
            title="编辑产品资产"
            visible
            width='60VW'
            onClose={() => props.close()}
        >

            <SearchForm
                search={(params: any) => {
                    console.log(params, 'parsm')
                }}
                formItems={[
                    {
                        label: "ID",
                        key: "id$LIKE",
                        type: 'string'
                    },
                    {
                        label: "名称",
                        key: "name$LIKE",
                        type: 'string'
                    }
                ]}
            />
            <Button onClick={() => setAdd(true)}>添加</Button>
            <Table
                rowKey="id"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={list?.data} />,
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={() => {
                        props.close();
                    }}
                    style={{ marginRight: 8 }}
                >
                    关闭
                </Button>
                <Button
                    onClick={() => {
                        // autzSetting();
                    }}
                    type="primary"
                >
                    保存
                </Button>
            </div>
            {add && <Add data={data} close={() => setAdd(false)} />}
            {cat && <User asset={asset} close={() => setCat(false)} />}
        </Drawer>
    )
}
export default Edit;