<script lang="tsx">
  import { defineComponent, nextTick, watch } from 'vue';
  import { isFunction } from '@p-helper/utils/is';
  // import { useModalContext } from '@p-helper/components/Modal/src/hooks/useModalContext';
  import { fileListProps } from './props';
  import type { CSSProperties } from 'vue';

  export default defineComponent({
    name: 'FileList',
    props: fileListProps,
    setup(props) {
      // const modalFn = useModalContext();
      watch(
        () => props.dataSource,
        () => {
          // console.log('modalFn >--->', modalFn);
          // nextTick(() => {
          //   modalFn?.redoModalHeight?.();
          // });
        }
      );
      return () => {
        const { columns, actionColumn, dataSource } = props;
        const columnList = [...columns, actionColumn].filter((item) => !!item);
        return (
          <table class="file-table">
            <colgroup>
              {columnList.map((item) => {
                const { width = 0, prop } = item;
                const style: CSSProperties = {
                  width: `${width}px`,
                  minWidth: `${width}px`,
                };
                return <col style={width ? style : {}} key={prop} />;
              })}
            </colgroup>
            <thead>
              <tr class="file-table-tr">
                {columnList.map((item) => {
                  const { label = '', align = 'center', prop } = item;
                  return (
                    <th class={['file-table-th', align]} key={prop}>
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataSource.map((record = {} as File, index) => {
                return (
                  <tr
                    class="file-table-tr"
                    key={`${index + record.name || ''}`}
                  >
                    {columnList.map((item) => {
                      const {
                        prop = '',
                        customRender,
                        align = 'center',
                      } = item;
                      const render = customRender && isFunction(customRender);
                      return (
                        <td class={['file-table-td', align]} key={prop}>
                          {render
                            ? customRender?.({
                                text: record[prop],
                                record,
                              })
                            : record[prop]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      };
    },
  });
</script>
