<script lang="tsx">
  import { defineComponent } from 'vue';
  import type { BasicColumn } from './types/table';
  // BasicTableColumn
  export default defineComponent({
    name: 'BasicTableColumn',
    props: {
      column: {
        type: Object as () => BasicColumn,
        required: true,
      },
      record: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const formatter = (_row, _style, val) => {
        return val ?? '--';
      };

      const renderColumn = () => {
        return (
          <el-table-column
            formatter={props.column.formatter || formatter}
            show-overflow-tooltip={true}
            {...props.column}
          ></el-table-column>
        );
      };

      return () => {
        return renderColumn();
      };
    },
  });
</script>
