import {
  ClientAction,
  ViewFieldDescriptor,
  ListViewContext,
  ObjectViewContext,
  ColumnContext,
  CellComponentRenderer,
  TableColumn,
  TableViewConfig,
  isBoolean,
  isNumber,
  isFunction,
  omit,
  getBehaviorByKey,
  getControl,
  getRenderer,
} from '@handie/runtime-core';
import { ReactNode, Component } from 'react';

import { ComponentCtor } from '../../types/component';
import { isComponentCtor } from '../../utils';
import ViewReactContext from '../../contexts/view';
import { DataTableProps } from './typing';

function createCellRenderer(
  viewContext: ObjectViewContext,
  renderFunc: () => ReactNode,
): ComponentCtor {
  return class CellRenderer extends Component {
    render() {
      return (
        <ViewReactContext.Provider value={{ viewContext }}>
          {renderFunc()}
        </ViewReactContext.Provider>
      );
    }
  };
}

function resolveCellRenderer(
  field: ViewFieldDescriptor,
  context: ListViewContext,
): CellComponentRenderer<TableColumn> | undefined {
  const widget = field.widget;

  return !isFunction(widget) || isComponentCtor(widget)
    ? (_, data: ColumnContext<TableColumn>) => {
        const CellRenderer = createCellRenderer(context.getChildren()[data.index], () => {
          const FieldRenderer = getRenderer('FieldRenderer') as ComponentCtor;
          const props = { ...data, field, value: data.row[data.column.key!], readonly: true };

          return FieldRenderer ? <FieldRenderer {...props} /> : null;
        });

        return <CellRenderer />;
      }
    : (widget as CellComponentRenderer<TableColumn>);
}

function isActionsAuthorized(
  actionsAuthority: string | undefined,
  authority: Record<string, boolean> | null,
): boolean {
  if (!actionsAuthority) {
    return true;
  }

  return authority ? !!authority[actionsAuthority] : false;
}

function resolveActionsAuthority(context: ListViewContext, vm): string | undefined {
  const actionsAuthority = context.getActionsAuthority();

  return isFunction(actionsAuthority)
    ? (actionsAuthority as (...args: any[]) => string)(vm)
    : (actionsAuthority as string | undefined);
}

function resolveAuthorizedActions(
  actions: ClientAction[],
  actionsAuthority: string | undefined,
  authority: Record<string, boolean> | null,
  vm,
): ClientAction[] {
  if (actionsAuthority) {
    return actions;
  }

  if (!authority) {
    return [];
  }

  return actions.filter(({ authority: auth }) => {
    const resolvedAuth = isFunction(auth)
      ? (auth as (...args: any[]) => string)(vm)
      : (auth as string | undefined);

    return !resolvedAuth || !!authority[resolvedAuth];
  });
}

function resolveTopActions(
  context: ListViewContext,
  authority: Record<string, any> | null,
  vm,
): ClientAction[] {
  const actionsAuthority = resolveActionsAuthority(context, vm);

  return isActionsAuthorized(actionsAuthority as string | undefined, authority)
    ? resolveAuthorizedActions(
        context
          .getActions()
          .filter(({ context }) => context && context !== 'single') as ClientAction[],
        actionsAuthority as string | undefined,
        authority,
        vm,
      )
    : [];
}

function resolveOperationColumn(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
  vm,
  inlineButtonSize: string,
): TableColumn | null {
  const actionsAuthority = resolveActionsAuthority(context, vm);

  const allSingleActions = resolveAuthorizedActions(
    context.getActionsByContextType('single') as ClientAction[],
    actionsAuthority,
    authority,
    vm,
  );

  const col: TableColumn = {
    title: '操作',
    render: (_, { index }) => {
      const ctx = context.getChildren()[index];
      const CellRenderer = createCellRenderer(ctx, () => (
        <div>
          {resolveAuthorizedActions(
            ctx.getActions() as ClientAction[],
            actionsAuthority,
            authority,
            vm,
          ).map(action => {
            const { config = {}, ...others } = action;
            const ActionRenderer = getRenderer('ActionRenderer') as ComponentCtor;
            const actionNode = ActionRenderer ? (
              <ActionRenderer
                action={{ ...others, config: { size: inlineButtonSize, ...config } }}
                key={`${others.name || others.text}InlineActionOfTableViewWidget`}
              />
            ) : null;
            const Tooltip = getControl('Tooltip') as ComponentCtor;

            return config.showTooltip === true && Tooltip ? (
              <Tooltip
                className='ActionWidgetTooltip'
                content={action.text || ''}
                key={`${others.name || others.text}InlineActionTooltipOfTableViewWidget`}
              >
                {actionNode}
              </Tooltip>
            ) : (
              actionNode
            );
          })}
        </div>
      ));

      return <CellRenderer />;
    },
  };

  const { operationColumnWidth } = context.getConfig() as TableViewConfig;

  if (operationColumnWidth) {
    col.width = isNumber(operationColumnWidth)
      ? `${operationColumnWidth}px`
      : (operationColumnWidth as string);
  }

  return isActionsAuthorized(actionsAuthority, authority) && allSingleActions.length > 0
    ? col
    : null;
}

function resolveTooltipEnabled(field: ViewFieldDescriptor, context: ListViewContext): boolean {
  if (field.config && isBoolean(field.config.showOverflowTooltip)) {
    return field.config.showOverflowTooltip;
  }

  const { showTooltipWhenContentOverflow } = context.getConfig();

  return isBoolean(showTooltipWhenContentOverflow)
    ? showTooltipWhenContentOverflow
    : getBehaviorByKey('view.table.showTooltipWhenContentOverflow', false);
}

function resolveTableColumns(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
  vm,
  inlineButtonSize: string,
): TableColumn[] {
  const cols: TableColumn[] = context.getFields().map(field => ({
    key: field.name,
    title: field.label,
    ellipsis: resolveTooltipEnabled(field, context),
    render: resolveCellRenderer(field, context),
    ...(field.config || {}),
  }));

  const {
    showSerialNumber,
    serialNumberColumnWidth = getBehaviorByKey('view.table.serialNumberColumnWidth', '55'),
    checkable,
    selectionColumnWidth = getBehaviorByKey('view.table.selectionColumnWidth', '55'),
  } = context.getConfig();

  if (showSerialNumber === true) {
    cols.unshift({ title: '序号', type: 'index', width: serialNumberColumnWidth, align: 'center' });
  }

  const actionsAuthority = resolveActionsAuthority(context, vm);

  const checkableActions = isActionsAuthorized(actionsAuthority, authority)
    ? resolveAuthorizedActions(
        ([] as ClientAction[]).concat(
          (context.getActionsByContextType('batch') || []) as ClientAction[],
          (context.getActionsByContextType('both') || []) as ClientAction[],
        ),
        actionsAuthority,
        authority,
        vm,
      )
    : [];

  if (isBoolean(checkable) ? checkable : checkableActions.length > 0) {
    cols.unshift({ type: 'selection', width: selectionColumnWidth, align: 'center' });
  }

  const operationCol = resolveOperationColumn(context, authority, vm, inlineButtonSize);

  if (operationCol) {
    cols.push(operationCol);
  }

  return cols;
}

function resolveTableProps(
  context: ListViewContext,
  authority: Record<string, boolean> | null,
  vm,
  inlineButtonSize: string,
): DataTableProps {
  return {
    ...omit(context.getConfig(), [
      'checkable',
      'showSerialNumber',
      'title',
      'showTooltipWhenContentOverflow',
      'selectionColumnWidth',
      'serialNumberColumnWidth',
      'operationColumnWidth',
    ]),
    columns: resolveTableColumns(context, authority, vm, inlineButtonSize),
  };
}

export { resolveTopActions, resolveTableProps };
