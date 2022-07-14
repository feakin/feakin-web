import { mxCell } from 'mxgraph';

declare module 'mxgraph' {
  /**
   * Extends {@link mxEventSource} to implement a graph model. The graph model acts as
   * a wrapper around the cells which are in charge of storing the actual graph
   * datastructure. The model acts as a transactional wrapper with event
   * notification for all changes, whereas the cells contain the atomic
   * operations for updating the actual datastructure.
   *
   * ### Layers
   *
   * The cell hierarchy in the model must have a top-level root cell which
   * contains the layers (typically one default layer), which in turn contain the
   * top-level cells of the layers. This means each cell is contained in a layer.
   * If no layers are required, then all new cells should be added to the default
   * layer.
   *
   * Layers are useful for hiding and showing groups of cells, or for placing
   * groups of cells on top of other cells in the display. To identify a layer,
   * the {@link isLayer} function is used. It returns true if the parent of the given
   * cell is the root of the model.
   *
   * ### Events
   *
   * See events section for more details. There is a new set of events for
   * tracking transactional changes as they happen. The events are called
   * startEdit for the initial beginUpdate, executed for each executed change
   * and endEdit for the terminal endUpdate. The executed event contains a
   * property called change which represents the change after execution.
   *
   * ### Encoding the model
   *
   * #### To encode a graph model, use the following code:
   *
   * ```javascript
   * var enc = new mxCodec();
   * var node = enc.encode(graph.getModel());
   * ```
   *
   * This will create an XML node that contains all the model information.
   *
   * #### Encoding and decoding changes:
   *
   * For the encoding of changes, a graph model listener is required that encodes
   * each change from the given array of changes.
   *
   * ```javascript
   * model.addListener(mxEvent.CHANGE, function(sender, evt)
   * {
   *   var changes = evt.getProperty('edit').changes;
   *   var nodes = [];
   *   var codec = new mxCodec();
   *
   *   for (var i = 0; i < changes.length; i++)
   *   {
   *     nodes.push(codec.encode(changes[i]));
   *   }
   *   // do something with the nodes
   * });
   * ```
   *
   * For the decoding and execution of changes, the codec needs a lookup function
   * that allows it to resolve cell IDs as follows:
   *
   * ```javascript
   * var codec = new mxCodec();
   * codec.lookup(id)
   * {
   *   return model.getCell(id);
   * }
   * ```
   *
   * For each encoded change (represented by a node), the following code can be
   * used to carry out the decoding and create a change object.
   *
   * ```javascript
   * var changes = [];
   * var change = codec.decode(node);
   * change.model = model;
   * change.execute();
   * changes.push(change);
   * ```
   *
   * The changes can then be dispatched using the model as follows.
   *
   * ```javascript
   * var edit = new mxUndoableEdit(model, false);
   * edit.changes = changes;
   *
   * edit.notify()
   * {
   *   edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE,
   *   	'edit', edit, 'changes', edit.changes));
   *   edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY,
   *   	'edit', edit, 'changes', edit.changes));
   * }
   *
   * model.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
   * model.fireEvent(new mxEventObject(mxEvent.CHANGE,
   *    'edit', edit, 'changes', changes));
   * ```
   *
   * Event: mxEvent.CHANGE
   *
   * Fires when an undoable edit is dispatched. The `edit` property
   * contains the {@link mxUndoableEdit}. The `changes` property contains
   * the array of atomic changes inside the undoable edit. The changes property
   * is **deprecated**, please use edit.changes instead.
   *
   * ### Example
   *
   * For finding newly inserted cells, the following code can be used:
   *
   * ```javascript
   * graph.model.addListener(mxEvent.CHANGE, function(sender, evt)
   * {
   *   var changes = evt.getProperty('edit').changes;
   *
   *   for (var i = 0; i < changes.length; i++)
   *   {
   *     var change = changes[i];
   *
   *     if (change instanceof mxChildChange &&
   *       change.change.previous == null)
   *     {
   *       graph.startEditingAtCell(change.child);
   *       break;
   *     }
   *   }
   * });
   * ```
   *
   * Event: mxEvent.NOTIFY
   *
   * Same as <mxEvent.CHANGE>, this event can be used for classes that need to
   * implement a sync mechanism between this model and, say, a remote model. In
   * such a setup, only local changes should trigger a notify event and all
   * changes should trigger a change event.
   *
   * Event: mxEvent.EXECUTE
   *
   * Fires between begin- and endUpdate and after an atomic change was executed
   * in the model. The `change` property contains the atomic change
   * that was executed.
   *
   * Event: mxEvent.EXECUTED
   *
   * Fires between START_EDIT and END_EDIT after an atomic change was executed.
   * The `change` property contains the change that was executed.
   *
   * Event: mxEvent.BEGIN_UPDATE
   *
   * Fires after the {@link updateLevel} was incremented in {@link beginUpdate}. This event
   * contains no properties.
   *
   * Event: mxEvent.START_EDIT
   *
   * Fires after the {@link updateLevel} was changed from 0 to 1. This event
   * contains no properties.
   *
   * Event: mxEvent.END_UPDATE
   *
   * Fires after the {@link updateLevel} was decreased in {@link endUpdate} but before any
   * notification or change dispatching. The `edit` property contains
   * the {@link currentEdit}.
   *
   * Event: mxEvent.END_EDIT
   *
   * Fires after the {@link updateLevel} was changed from 1 to 0. This event
   * contains no properties.
   *
   * Event: mxEvent.BEFORE_UNDO
   *
   * Fires before the change is dispatched after the update level has reached 0
   * in {@link endUpdate}. The `edit` property contains the {@link curreneEdit}.
   *
   * Event: mxEvent.UNDO
   *
   * Fires after the change was dispatched in {@link endUpdate}. The `edit`
   * property contains the {@link currentEdit}.
   *
   * @class mxGraphModel
   */
  class mxGraphModel extends mxEventSource {
    constructor(root: mxCell);

    /**
     * Holds the root cell, which in turn contains the cells that represent the
     * layers of the diagram as child cells. That is, the actual elements of the
     * diagram are supposed to live in the third generation of cells and below.
     */
    root: mxCell;

    /**
     * Maps from Ids to cells.
     */
    cells: any;

    /**
     * Specifies if edges should automatically be moved into the nearest common
     * ancestor of their terminals. Default is true.
     */
    maintainEdgeParent: boolean;

    /**
     * Specifies if relative edge parents should be ignored for finding the nearest
     * common ancestors of an edge's terminals. Default is true.
     */
    ignoreRelativeEdgeParent: boolean;

    /**
     * Specifies if the model should automatically create Ids for new cells.
     * Default is true.
     */
    createIds: boolean;

    /**
     * Defines the prefix of new Ids. Default is an empty string.
     */
    prefix: string;

    /**
     * Defines the postfix of new Ids. Default is an empty string.
     */
    postfix: string;

    /**
     * Specifies the next Id to be created. Initial value is 0.
     */
    nextId: number | string;

    /**
     * Holds the changes for the current transaction. If the transaction is
     * closed then a new object is created for this variable using
     * {@link createUndoableEdit}.
     */
    currentEdit: any;

    /**
     * Counter for the depth of nested transactions. Each call to {@link beginUpdate}
     * will increment this number and each call to {@link endUpdate} will decrement
     * it. When the counter reaches 0, the transaction is closed and the
     * respective events are fired. Initial value is 0.
     */
    updateLevel: number;

    /**
     * True if the program flow is currently inside endUpdate.
     */
    endingUpdate: boolean;

    /**
     * Sets a new root using {@link createRoot}.
     */
    clear(): void;

    /**
     * Returns {@link createIds}.
     */
    isCreateIds(): boolean;

    /**
     * Sets {@link createIds}.
     */
    setCreateIds(value: boolean): void;

    /**
     * Creates a new root cell with a default layer (child 0).
     */
    createRoot(): mxCell;

    /**
     * Returns the {@link mxCell} for the specified Id or null if no cell can be
     * found for the given Id.
     *
     * @param {string} id  A string representing the Id of the cell.
     */
    getCell(id: string): mxCell;

    /**
     * Returns the cells from the given array where the given filter function
     * returns true.
     */
    filterCells(cells: Array<mxCell>, filter: (cell: mxCell) => boolean): Array<mxCell>;

    /**
     * Returns all descendants of the given cell and the cell itself in an array.
     *
     * @param {mxCell} parent  whose descendants should be returned.
     */
    getDescendants(parent: mxCell): Array<mxCell>;

    /**
     * Visits all cells recursively and applies the specified filter function
     * to each cell. If the function returns true then the cell is added
     * to the resulting array. The parent and result paramters are optional.
     * If parent is not specified then the recursion starts at {@link root}.
     *
     * Example:
     * The following example extracts all vertices from a given model:
     * ```javascript
     * var filter(cell)
     * {
     * 	return model.isVertex(cell);
     * }
     * var vertices = model.filterDescendants(filter);
     * ```
     *
     * @param filter  JavaScript function that takes an {@link mxCell} as an argument
     * and returns a boolean.
     * @param parent  Optional {@link mxCell} that is used as the root of the recursion.
     */
    filterDescendants(filter: (cell: mxCell) => boolean, parent?: mxCell): Array<mxCell>;

    /**
     * Returns the root of the model or the topmost parent of the given cell.
     *
     * @param cell  Optional {@link mxCell} that specifies the child.
     */
    getRoot(cell?: mxCell): mxCell;

    /**
     * Sets the {@link root} of the model using {@link mxRootChange} and adds the change to
     * the current transaction. This resets all datastructures in the model and
     * is the preferred way of clearing an existing model. Returns the new
     * root.
     *
     * Example:
     *
     * ```javascript
     * var root = new mxCell();
     * root.insert(new mxCell());
     * model.setRoot(root);
     * ```
     *
     * @param {mxCell} root  that specifies the new root.
     */
    setRoot(root: mxCell): mxCell;

    /**
     * Inner callback to change the root of the model and update the internal
     * datastructures, such as {@link cells} and {@link nextId}. Returns the previous root.
     *
     * @param {mxCell} root  that specifies the new root.
     */
    rootChanged(root: mxCell): mxCell;

    /**
     * Returns true if the given cell is the root of the model and a non-null
     * value.
     *
     * @param {mxCell} cell  that represents the possible root.
     */
    isRoot(cell: mxCell): boolean;

    /**
     * Returns true if {@link isRoot} returns true for the parent of the given cell.
     *
     * @param {mxCell} cell  that represents the possible layer.
     */
    isLayer(cell: mxCell): boolean;

    /**
     * Returns true if the given parent is an ancestor of the given child. Note
     * returns true if child == parent.
     *
     * @param {mxCell} parent  that specifies the parent.
     * @param {mxCell} child  that specifies the child.
     */
    isAncestor(parent: mxCell, child: mxCell): boolean;

    /**
     * Returns true if the model contains the given {@link mxCell}.
     *
     * @param {mxCell} cell  that specifies the cell.
     */
    contains(cell: mxCell): boolean;

    /**
     * Returns the parent of the given cell.
     *
     * @param {mxCell} cell  whose parent should be returned.
     */
    getParent(cell: mxCell): mxCell;

    /**
     * Adds the specified child to the parent at the given index using
     * {@link mxChildChange} and adds the change to the current transaction. If no
     * index is specified then the child is appended to the parent's array of
     * children. Returns the inserted child.
     *
     * @param {mxCell} parent  that specifies the parent to contain the child.
     * @param {mxCell} child  that specifies the child to be inserted.
     * @param index  Optional integer that specifies the index of the child.
     */
    add(parent: mxCell, child: mxCell, index?: number): mxCell;

    /**
     * Inner callback to update {@link cells} when a cell has been added. This
     * implementation resolves collisions by creating new Ids. To change the
     * ID of a cell after it was inserted into the model, use the following
     * code:
     *
     * (code
     * delete model.cells[cell.getId()];
     * cell.setId(newId);
     * model.cells[cell.getId()] = cell;
     * ```
     *
     * If the change of the ID should be part of the command history, then the
     * cell should be removed from the model and a clone with the new ID should
     * be reinserted into the model instead.
     *
     * @param {mxCell} cell  that specifies the cell that has been added.
     */
    cellAdded(cell: mxCell): void;

    /**
     * Hook method to create an Id for the specified cell. This implementation
     * concatenates {@link prefix}, id and {@link postfix} to create the Id and increments
     * {@link nextId}. The cell is ignored by this implementation, but can be used in
     * overridden methods to prefix the Ids with eg. the cell type.
     *
     * @param {mxCell} cell  to create the Id for.
     */
    createId(cell: mxCell): string;

    /**
     * Updates the parent for all edges that are connected to cell or one of
     * its descendants using {@link updateEdgeParent}.
     */
    updateEdgeParents(cell: mxCell, root: mxCell): void;

    /**
     * Inner callback to update the parent of the specified {@link mxCell} to the
     * nearest-common-ancestor of its two terminals.
     *
     * @param {mxCell} edge  that specifies the edge.
     * @param {mxCell} root  that represents the current root of the model.
     */
    updateEdgeParent(edge: mxCell, root: mxCell): void;

    /**
     * Returns the absolute, accumulated origin for the children inside the
     * given parent as an {@link mxPoint}.
     */
    getOrigin(cell: mxCell): mxPoint;

    /**
     * Returns the nearest common ancestor for the specified cells.
     *
     * @param {mxCell} cell1  that specifies the first cell in the tree.
     * @param {mxCell} cell2  that specifies the second cell in the tree.
     */
    getNearestCommonAncestor(cell1: mxCell, cell2: mxCell): mxCell;

    /**
     * Removes the specified cell from the model using {@link mxChildChange} and adds
     * the change to the current transaction. This operation will remove the
     * cell and all of its children from the model. Returns the removed cell.
     *
     * @param {mxCell} cell  that should be removed.
     */
    remove(cell: mxCell): mxCell;

    /**
     * Inner callback to update {@link cells} when a cell has been removed.
     *
     * @param {mxCell} cell  that specifies the cell that has been removed.
     */
    cellRemoved(cell: mxCell): void;

    /**
     * Inner callback to update the parent of a cell using <mxCell.insert>
     * on the parent and return the previous parent.
     *
     * @param {mxCell} cell  to update the parent for.
     * @param {mxCell} parent  that specifies the new parent of the cell.
     * @param index  Optional integer that defines the index of the child
     * in the parent's child array.
     */
    parentForCellChanged(cell: mxCell, parent: mxCell, index: number): mxCell;

    /**
     * Returns the number of children in the given cell.
     *
     * @param {mxCell} cell  whose number of children should be returned.
     */
    getChildCount(cell?: mxCell): number;

    /**
     * Returns the child of the given {@link mxCell} at the given index.
     *
     * @param {mxCell} cell  that represents the parent.
     * @param index  Integer that specifies the index of the child to be returned.
     */
    getChildAt(cell: mxCell, index: number): mxCell;

    /**
     * Returns all children of the given {@link mxCell} as an array of {@link mxCell}. The
     * return value should be only be read.
     *
     * @param {mxCell} cell  the represents the parent.
     */
    getChildren(cell: mxCell): Array<mxCell>;

    /**
     * Returns the child vertices of the given parent.
     *
     * @param {mxCell} cell  whose child vertices should be returned.
     */
    getChildVertices(parent: mxCell): Array<mxCell>;

    /**
     * Returns the child edges of the given parent.
     *
     * @param {mxCell} cell  whose child edges should be returned.
     */
    getChildEdges(parent: mxCell): Array<mxCell>;

    /**
     * Returns the children of the given cell that are vertices and/or edges
     * depending on the arguments.
     *
     * @param {mxCell} cell  the represents the parent.
     * @param vertices  Boolean indicating if child vertices should be returned.
     * Default is false.
     * @param edges  Boolean indicating if child edges should be returned.
     * Default is false.
     */
    getChildCells(parent: mxCell, vertices?: boolean, edges?: boolean): Array<mxCell>;

    /**
     * Returns the source or target {@link mxCell} of the given edge depending on the
     * value of the boolean parameter.
     *
     * @param {mxCell} edge  that specifies the edge.
     * @param isSource  Boolean indicating which end of the edge should be returned.
     */
    getTerminal(edge: mxCell, isSource: boolean): mxCell;

    /**
     * Sets the source or target terminal of the given {@link mxCell} using
     * {@link mxTerminalChange} and adds the change to the current transaction.
     * This implementation updates the parent of the edge using {@link updateEdgeParent}
     * if required.
     *
     * @param {mxCell} edge  that specifies the edge.
     * @param {mxCell} terminal  that specifies the new terminal.
     * @param isSource  Boolean indicating if the terminal is the new source or
     * target terminal of the edge.
     */
    setTerminal(edge: mxCell, terminal: mxCell, isSource: boolean): mxCell;

    /**
     * Sets the source and target {@link mxCell} of the given {@link mxCell} in a single
     * transaction using {@link setTerminal} for each end of the edge.
     *
     * @param {mxCell} edge  that specifies the edge.
     * @param {mxCell} source  that specifies the new source terminal.
     * @param {mxCell} target  that specifies the new target terminal.
     */
    setTerminals(edge: mxCell, source: mxCell, target: mxCell): void;

    /**
     * Inner helper function to update the terminal of the edge using
     * <mxCell.insertEdge> and return the previous terminal.
     *
     * @param {mxCell} edge  that specifies the edge to be updated.
     * @param {mxCell} terminal  that specifies the new terminal.
     * @param isSource  Boolean indicating if the terminal is the new source or
     * target terminal of the edge.
     */
    terminalForCellChanged(edge: mxCell, terminal: mxCell, isSource: boolean): mxCell;

    /**
     * Returns the number of distinct edges connected to the given cell.
     *
     * @param {mxCell} cell  that represents the vertex.
     */
    getEdgeCount(cell: mxCell): number;

    /**
     * Returns the edge of cell at the given index.
     *
     * @param {mxCell} cell  that specifies the vertex.
     * @param index  Integer that specifies the index of the edge
     * to return.
     */
    getEdgeAt(cell: mxCell, index: number): mxCell;

    /**
     * Returns the number of incoming or outgoing edges, ignoring the given
     * edge.
     *
     * @param {mxCell} cell  whose edge count should be returned.
     * @param outgoing  Boolean that specifies if the number of outgoing or
     * incoming edges should be returned.
     * @param {mxCell} ignoredEdge  that represents an edge to be ignored.
     */
    getDirectedEdgeCount(cell: mxCell, outgoing: boolean, ignoredEdge: boolean): number;

    /**
     * Returns all edges of the given cell without loops.
     *
     * @param {mxCell} cell  whose edges should be returned.
     *
     */
    getConnections(cell: mxCell): Array<mxCell>;

    /**
     * Returns the incoming edges of the given cell without loops.
     *
     * @param {mxCell} cell  whose incoming edges should be returned.
     *
     */
    getIncomingEdges(cell: mxCell): Array<mxCell>;

    /**
     * Returns the outgoing edges of the given cell without loops.
     *
     * @param {mxCell} cell  whose outgoing edges should be returned.
     *
     */
    getOutgoingEdges(cell: mxCell): Array<mxCell>;

    /**
     * Returns all distinct edges connected to this cell as a new array of
     * {@link mxCell}. If at least one of incoming or outgoing is true, then loops
     * are ignored, otherwise if both are false, then all edges connected to
     * the given cell are returned including loops.
     *
     * @param {mxCell} cell  that specifies the cell.
     * @param incoming  Optional boolean that specifies if incoming edges should be
     * returned. Default is true.
     * @param outgoing  Optional boolean that specifies if outgoing edges should be
     * returned. Default is true.
     * @param includeLoops  Optional boolean that specifies if loops should be returned.
     * Default is true.
     */
    getEdges(cell: mxCell, incoming?: boolean, outgoing?: boolean, includeLoops?: boolean): Array<mxCell>;

    /**
     * Returns all edges between the given source and target pair. If directed
     * is true, then only edges from the source to the target are returned,
     * otherwise, all edges between the two cells are returned.
     *
     * @param {mxCell} source  that defines the source terminal of the edge to be
     * returned.
     * @param {mxCell} target  that defines the target terminal of the edge to be
     * returned.
     * @param directed  Optional boolean that specifies if the direction of the
     * edge should be taken into account. Default is false.
     */
    getEdgesBetween(source: mxCell, target: mxCell, directed?: boolean): Array<mxCell>;

    /**
     * Returns all opposite vertices wrt terminal for the given edges, only
     * returning sources and/or targets as specified. The result is returned
     * as an array of {@link mxCell}.
     *
     * @param edges  Array of {@link mxCell} that contain the edges to be examined.
     * @param {mxCell} terminal  that specifies the known end of the edges.
     * @param sources  Boolean that specifies if source terminals should be contained
     * in the result. Default is true.
     * @param targets  Boolean that specifies if target terminals should be contained
     * in the result. Default is true.
     */
    getOpposites(edges: Array<mxCell>, terminal: mxCell, sources?: boolean, targets?: boolean): Array<mxCell>;

    /**
     * Returns the topmost cells of the hierarchy in an array that contains no
     * descendants for each {@link mxCell} that it contains. Duplicates should be
     * removed in the cells array to improve performance.
     *
     * @param cells  Array of {@link mxCell} whose topmost ancestors should be returned.
     */
    getTopmostCells(cells: Array<mxCell>): Array<mxCell>;

    /**
     * Returns true if the given cell is a vertex.
     *
     * @param {mxCell} cell  that represents the possible vertex.
     */
    isVertex(cell: mxCell): boolean;

    /**
     * Returns true if the given cell is an edge.
     *
     * @param {mxCell} cell  that represents the possible edge.
     */
    isEdge(cell: mxCell): boolean;

    /**
     * Returns true if the given {@link mxCell} is connectable. If {@link edgesConnectable}
     * is false, then this function returns false for all edges else it returns
     * the return value of <mxCell.isConnectable>.
     *
     * @param {mxCell} cell  whose connectable state should be returned.
     */
    isConnectable(cell: mxCell): boolean;

    /**
     * Returns the user object of the given {@link mxCell} using <mxCell.getValue>.
     *
     * @param {mxCell} cell  whose user object should be returned.
     */
    getValue(cell: mxCell): any;

    /**
     * Sets the user object of then given {@link mxCell} using {@link mxValueChange}
     * and adds the change to the current transaction.
     *
     * @param {mxCell} cell  whose user object should be changed.
     * @param value  Object that defines the new user object.
     */
    setValue(cell: mxCell, value: any): any;

    /**
     * Inner callback to update the user object of the given {@link mxCell}
     * using <mxCell.valueChanged> and return the previous value,
     * that is, the return value of <mxCell.valueChanged>.
     *
     * To change a specific attribute in an XML node, the following code can be
     * used.
     *
     * ```javascript
     * graph.getModel().valueForCellChanged(cell, value)
     * {
     *   var previous = cell.value.getAttribute('label');
     *   cell.value.setAttribute('label', value);
     *
     *   return previous;
     * };
     * ```
     */
    valueForCellChanged(cell: mxCell, value: any): any;

    /**
     * Returns the {@link mxGeometry} of the given {@link mxCell}.
     *
     * @param {mxCell} cell  whose geometry should be returned.
     */
    getGeometry(cell: mxCell): mxGeometry;

    /**
     * Sets the {@link mxGeometry} of the given {@link mxCell}. The actual update
     * of the cell is carried out in {@link geometryForCellChanged}. The
     * {@link mxGeometryChange} action is used to encapsulate the change.
     *
     * @param {mxCell} cell  whose geometry should be changed.
     * @param {mxGeometry} geometry  that defines the new geometry.
     */
    setGeometry(cell: mxCell, geometry: mxGeometry): mxGeometry;

    /**
     * Inner callback to update the {@link mxGeometry} of the given {@link mxCell} using
     * <mxCell.setGeometry> and return the previous {@link mxGeometry}.
     */
    geometryForCellChanged(cell: mxCell, geometry: mxGeometry): mxGeometry;

    /**
     * Returns the style of the given {@link mxCell}.
     *
     * @param {mxCell} cell  whose style should be returned.
     */
    getStyle(cell: mxCell): string | null;

    /**
     * Sets the style of the given {@link mxCell} using {@link mxStyleChange} and
     * adds the change to the current transaction.
     *
     * @param {mxCell} cell  whose style should be changed.
     * @param style  String of the form [stylename;|key=value;] to specify
     * the new cell style.
     */
    setStyle(cell: mxCell, style: string): string;

    /**
     * Inner callback to update the style of the given {@link mxCell}
     * using <mxCell.setStyle> and return the previous style.
     *
     * @param {mxCell} cell  that specifies the cell to be updated.
     * @param style  String of the form [stylename;|key=value;] to specify
     * the new cell style.
     */
    styleForCellChanged(cell: mxCell, style: string): string;

    /**
     * Returns true if the given {@link mxCell} is collapsed.
     *
     * @param {mxCell} cell  whose collapsed state should be returned.
     */
    isCollapsed(cell: mxCell): boolean;

    /**
     * Sets the collapsed state of the given {@link mxCell} using {@link mxCollapseChange}
     * and adds the change to the current transaction.
     *
     * @param {mxCell} cell  whose collapsed state should be changed.
     * @param collapsed  Boolean that specifies the new collpased state.
     */
    setCollapsed(cell: mxCell, collapsed: boolean): boolean;

    /**
     * Inner callback to update the collapsed state of the
     * given {@link mxCell} using <mxCell.setCollapsed> and return
     * the previous collapsed state.
     *
     * @param {mxCell} cell  that specifies the cell to be updated.
     * @param collapsed  Boolean that specifies the new collpased state.
     */
    collapsedStateForCellChanged(cell: mxCell, collapsed: boolean): boolean;

    /**
     * Returns true if the given {@link mxCell} is visible.
     *
     * @param {mxCell} cell  whose visible state should be returned.
     */
    isVisible(cell: mxCell): boolean;

    /**
     * Sets the visible state of the given {@link mxCell} using {@link mxVisibleChange} and
     * adds the change to the current transaction.
     *
     * @param {mxCell} cell  whose visible state should be changed.
     * @param visible  Boolean that specifies the new visible state.
     */
    setVisible(cell: mxCell, visible: boolean): boolean;

    /**
     * Inner callback to update the visible state of the
     * given {@link mxCell} using <mxCell.setCollapsed> and return
     * the previous visible state.
     *
     * @param {mxCell} cell  that specifies the cell to be updated.
     * @param visible  Boolean that specifies the new visible state.
     */
    visibleStateForCellChanged(cell: mxCell, visible: boolean): boolean;

    /**
     * Executes the given edit and fires events if required. The edit object
     * requires an execute function which is invoked. The edit is added to the
     * {@link currentEdit} between {@link beginUpdate} and {@link endUpdate} calls, so that
     * events will be fired if this execute is an individual transaction, that
     * is, if no previous {@link beginUpdate} calls have been made without calling
     * {@link endUpdate}. This implementation fires an {@link execute} event before
     * executing the given change.
     *
     * @param change  Object that described the change.
     */
    execute(change: any): void;

    /**
     * Increments the {@link updateLevel} by one. The event notification
     * is queued until {@link updateLevel} reaches 0 by use of
     * {@link endUpdate}.
     *
     * All changes on {@link mxGraphModel} are transactional,
     * that is, they are executed in a single undoable change
     * on the model (without transaction isolation).
     * Therefore, if you want to combine any
     * number of changes into a single undoable change,
     * you should group any two or more API calls that
     * modify the graph model between {@link beginUpdate}
     * and {@link endUpdate} calls as shown here:
     *
     * ```javascript
     * var model = graph.getModel();
     * var parent = graph.getDefaultParent();
     * var index = model.getChildCount(parent);
     * model.beginUpdate();
     * try
     * {
     *   model.add(parent, v1, index);
     *   model.add(parent, v2, index+1);
     * }
     * finally
     * {
     *   model.endUpdate();
     * }
     * ```
     *
     * Of course there is a shortcut for appending a
     * sequence of cells into the default parent:
     *
     * ```javascript
     * graph.addCells([v1, v2]).
     * ```
     */
    beginUpdate(): void;

    /**
     * Decrements the {@link updateLevel} by one and fires an {@link undo}
     * event if the {@link updateLevel} reaches 0. This function
     * indirectly fires a {@link change} event by invoking the notify
     * function on the {@link currentEdit} und then creates a new
     * {@link currentEdit} using {@link createUndoableEdit}.
     *
     * The {@link undo} event is fired only once per edit, whereas
     * the {@link change} event is fired whenever the notify
     * function is invoked, that is, on undo and redo of
     * the edit.
     */
    endUpdate(): void;

    /**
     * Creates a new {@link mxUndoableEdit} that implements the
     * notify function to fire a {@link change} and {@link notify} event
     * through the {@link mxUndoableEdit}'s source.
     *
     * @param significant  Optional boolean that specifies if the edit to be created is
     * significant. Default is true.
     */
    createUndoableEdit(significant?: boolean): mxUndoableEdit;

    /**
     * Merges the children of the given cell into the given target cell inside
     * this model. All cells are cloned unless there is a corresponding cell in
     * the model with the same id, in which case the source cell is ignored and
     * all edges are connected to the corresponding cell in this model. Edges
     * are considered to have no identity and are always cloned unless the
     * cloneAllEdges flag is set to false, in which case edges with the same
     * id in the target model are reconnected to reflect the terminals of the
     * source edges.
     */
    mergeChildren(from: mxGraphModel, to: mxGraphModel, cloneAllEdges?: boolean): void;

    /**
     * Clones the children of the source cell into the given target cell in
     * this model and adds an entry to the mapping that maps from the source
     * cell to the target cell with the same id or the clone of the source cell
     * that was inserted into this model.
     */
    mergeChildrenImpl(from: mxGraphModel, to: mxGraphModel, cloneAllEdges: boolean, mapping: any): void;

    /**
     * Returns an array that represents the set (no duplicates) of all parents
     * for the given array of cells.
     *
     * @param cells  Array of cells whose parents should be returned.
     */
    getParents(cells: Array<mxCell>): Array<mxCell>;

    /**
     * Returns a deep clone of the given {@link mxCell}` (including
     * the children) which is created using {@link cloneCells}`.
     *
     * @param {mxCell} cell  to be cloned.
     */
    cloneCell(cell: mxCell): mxCell;

    /**
     * Returns an array of clones for the given array of {@link mxCell}`.
     * Depending on the value of includeChildren, a deep clone is created for
     * each cell. Connections are restored based if the corresponding
     * cell is contained in the passed in array.
     *
     * @param cells  Array of {@link mxCell}` to be cloned.
     * @param includeChildren  Boolean indicating if the cells should be cloned
     * with all descendants.
     * @param mapping  Optional mapping for existing clones.
     */
    cloneCells(cells: Array<mxCell>, includeChildren?: boolean, mapping?: any): Array<mxCell>;

    /**
     * Inner helper method for cloning cells recursively.
     */
    cloneCellImpl(cell: mxCell, mapping?: any, includeChildren?: boolean): mxCell;

    /**
     * Hook for cloning the cell. This returns cell.clone() or
     * any possible exceptions.
     */
    cellCloned(cell: mxCell): mxCell;

    /**
     * Inner helper method for restoring the connections in
     * a network of cloned cells.
     */
    restoreClone(clone: mxCell, cell: mxCell, mapping?: any): void;
  }

  /**
   * Action to change the root in a model.
   *
   * Constructor: mxRootChange
   *
   * Constructs a change of the root in the
   * specified model.
   *
   * @class mxRootChange
   */
  class mxRootChange {
    constructor(model: mxGraphModel, root: mxCell);

    /**
     * Carries out a change of the root using
     * <mxGraphModel.rootChanged>.
     */
    execute(): void;
  }

  /**
   * Action to add or remove a child in a model.
   *
   * Constructor: mxChildChange
   *
   * Constructs a change of a child in the
   * specified model.
   *
   * @class mxChildChange
   */
  class mxChildChange {
    constructor(model: mxGraphModel, parent: mxCell, child: mxCell, index: number);

    child: mxCell;

    index: number;

    model: mxGraphModel;

    parent: mxCell;

    previous: any;

    previousIndex: number;

    /**
     * Changes the parent of {@link child}` using
     * <mxGraphModel.parentForCellChanged> and
     * removes or restores the cell's
     * connections.
     */
    execute(): void;

    /**
     * Disconnects the given cell recursively from its
     * terminals and stores the previous terminal in the
     * cell's terminals.
     *
     * @warning doc from mxGraph source code is incorrect
     */
    connect(cell: mxCell, isConnect: boolean): void;
  }

  /**
   * Action to change a terminal in a model.
   *
   * Constructor: mxTerminalChange
   *
   * Constructs a change of a terminal in the
   * specified model.
   */
  class mxTerminalChange {
    constructor(model: mxGraphModel, cell: mxCell, terminal: mxCell, source: boolean);

    /**
     * Changes the terminal of {@link cell}` to {@link previous}` using
     * <mxGraphModel.terminalForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Action to change a user object in a model.
   *
   * Constructs a change of a user object in the
   * specified model.
   *
   * @class mxValueChange
   */
  class mxValueChange {
    constructor(model: mxGraphModel, cell: mxCell, value: any);

    /**
     * Changes the value of {@link cell}` to {@link previous}` using
     * <mxGraphModel.valueForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Action to change a cell's style in a model.
   *
   * @class mxStyleChange
   */
  class mxStyleChange {
    constructor(model: mxGraphModel, cell: mxCell, style?: string);
    /**
     * Function: execute
     *
     * Changes the style of {@link cell}` to {@link previous}` using
     * <mxGraphModel.styleForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Class: mxGeometryChange
   *
   * Action to change a cell's geometry in a model.
   *
   * Constructor: mxGeometryChange
   *
   * Constructs a change of a geometry in the
   * specified model.
   */
  class mxGeometryChange {
    constructor(model: mxGraphModel, cell: mxCell, geometry: mxGeometry);

    model: mxGraphModel;

    cell: mxCell;

    geometry: mxGeometry;

    previous: mxGeometry;

    /**
     * Function: execute
     *
     * Changes the geometry of {@link cell}` ro {@link previous}` using
     * <mxGraphModel.geometryForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Class: mxCollapseChange
   *
   * Action to change a cell's collapsed state in a model.
   *
   * Constructor: mxCollapseChange
   *
   * Constructs a change of a collapsed state in the
   * specified model.
   */
  class mxCollapseChange {
    constructor(model: mxGraphModel, cell: mxCell, collapsed: boolean);

    model: mxGraphModel;

    cell: mxCell;

    geometry: boolean;

    previous: boolean;

    /**
     * Function: execute
     *
     * Changes the collapsed state of {@link cell}` to {@link previous}` using
     * <mxGraphModel.collapsedStateForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Class: mxVisibleChange
   *
   * Action to change a cell's visible state in a model.
   *
   * Constructor: mxVisibleChange
   *
   * Constructs a change of a visible state in the
   * specified model.
   */
  class mxVisibleChange {
    constructor(model: mxGraphModel, cell: mxCell, visible: boolean);

    /**
     * Function: execute
     *
     * Changes the visible state of {@link cell}` to {@link previous}` using
     * <mxGraphModel.visibleStateForCellChanged>.
     */
    execute(): void;
  }

  /**
   * Class: mxCellAttributeChange
   *
   * Action to change the attribute of a cell's user object.
   * There is no method on the graph model that uses this
   * action. To use the action, you can use the code shown
   * in the example below.
   *
   * Example:
   *
   * To change the attributeName in the cell's user object
   * to attributeValue, use the following code:
   *
   * ```javascript
   * model.beginUpdate();
   * try
   * {
   *   var edit = new mxCellAttributeChange(
   *     cell, attributeName, attributeValue);
   *   model.execute(edit);
   * }
   * finally
   * {
   *   model.endUpdate();
   * }
   * ```
   *
   * Constructor: mxCellAttributeChange
   *
   * Constructs a change of a attribute of the DOM node
   * stored as the value of the given {@link mxCell}`.
   */
  class mxCellAttributeChange {
    constructor(cell: mxCell, attribute: string, value: any);

    /**
     * Function: execute
     *
     * Changes the attribute of the cell's user object by
     * using <mxCell.setAttribute>.
     */
    execute(): void;
  }
}
