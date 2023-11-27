import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, 
Resize, Sort, ContextMenu, Filter, Page, ExcelExport, 
PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { Header, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Elenco = () => {
  const { currentColor } = useStateContext();

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Header category='Clube' title='Elenco' />
        <Button 
          color='white'
          bgColor={currentColor}
          text='Adicionar Atleta'
          borderRadius='10px'
          size='md'
        />
      </div>
      <GridComponent
        id='gridcomp'
        dataSource={ordersData}
        allowPaging
        allowSorting
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item}/>
          ))}
        </ColumnsDirective>
        <Inject services={[
          Resize, Sort, ContextMenu, Filter,
          Page, ExcelExport, Edit, PdfExport
        ]}/>
      </GridComponent>
    </div>
  );
}

export default Elenco;
