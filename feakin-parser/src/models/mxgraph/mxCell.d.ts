declare module 'mxgraph' {
  /**
   * Cells are the elements of the graph model. They represent the state
   * of the groups, vertices and edges in a graph.
   *
   * ### Custom attributes
   * For custom attributes we recommend using an XML node as the value of a cell.
   * The following code can be used to create a cell with an XML node as the value:
   * @example
   * ```javascript
   * var doc = mxUtils.createXmlDocument();
   * var node = doc.createElement('MyNode')
   * node.setAttribute('label', 'MyLabel');
   * node.setAttribute('attribute1', 'value1');
   * graph.insertVertex(graph.getDefaultParent(), null, node, 40, 40, 80, 30);
   * ```
   *
   * For the label to work, {@link mxGraph.convertValueToString} and
   * {@link mxGraph.cellLabelChanged} should be overridden as follows:
   *
   * @example
   * ```javascript
   * graph.convertValueToString(cell)
   * {
   *   if (mxUtils.isNode(cell.value))
   *   {
   *     return cell.getAttribute('label', '')
   *   }
   * };
   *
   * var cellLabelChanged = graph.cellLabelChanged;
   * graph.cellLabelChanged(cell, newValue, autoSize)
   * {
   *   if (mxUtils.isNode(cell.value))
   *   {
   *     // Clones the value for correct undo/redo
   *     var elt = cell.value.cloneNode(true);
   *     elt.setAttribute('label', newValue);
   *     newValue = elt;
   *   }
   *
   *   cellLabelChanged.apply(this, arguments);
   * };
   * ```
   * @class mxCell
   */
  class mxCell {
    /**
     * @param {*} value               Optional object that represents the cell value.
     * @param {mxGeometry} geometry   Optional <mxGeometry> that specifies the geometry.
     * @param {string} style          Optional formatted string that defines the style.
     */
    constructor(value?: any, geometry?: mxGeometry, style?: string);

    /**
     * @see {mxGraph.getCellOverlays}
     *
     * @type {Array<mxCellOverlay>}
     */
    overlays: Array<mxCellOverlay>;

    /**
     * Holds the Id. Default is null.
     */
    id: string;

    /**
     * Holds the user object. Default is null.
     */
    value: any;

    /**
     * Holds the <mxGeometry>. Default is null.
     */
    geometry: mxGeometry;

    /**
     * Holds the style as a string of the form [(stylename|key=value);]. Default is
     * null.
     */
    style: string;

    /**
     * Specifies whether the cell is a vertex. Default is false.
     */
    vertex: boolean;

    /**
     * Specifies whether the cell is an edge. Default is false.
     */
    edge: boolean;

    /**
     * Specifies whether the cell is connectable. Default is true.
     */
    connectable: boolean;

    /**
     * Specifies whether the cell is visible. Default is true.
     */
    visible: boolean;

    /**
     * Specifies whether the cell is collapsed. Default is false.
     */
    collapsed: boolean;

    /**
     * Reference to the parent cell.
     */
    parent: mxCell;

    /**
     * Reference to the source terminal.
     */
    source: mxCell;

    /**
     * Reference to the target terminal.
     */
    target: mxCell;

    /**
     * Holds the child cells.
     */
    children: Array<mxCell>;

    /**
     * Holds the edges.
     */
    edges: Array<mxCell>;

    /**
     * List of members that should not be cloned inside <clone>. This field is
     * passed to <mxUtils.clone> and is not made persistent in <mxCellCodec>.
     * This is not a convention for all classes, it is only used in this class
     * to mark transient fields since transient modifiers are not supported by
     * the language.
     */
    mxTransient: Array<string>;

    /**
     * Returns the Id of the cell as a string.
     */
    getId(): string;

    /**
     * Sets the Id of the cell to the given string.
     */
    setId(id: string): void;

    /**
     * Returns the user object of the cell. The user
     * object is stored in <value>.
     */
    getValue(): any;

    /**
     * Sets the user object of the cell. The user object
     * is stored in <value>.
     */
    setValue(value: any): void;

    /**
     * Changes the user object after an in-place edit
     * and returns the previous value. This implementation
     * replaces the user object with the given value and
     * returns the old user object.
     */
    valueChanged(newValue: any): any;

    /**
     * Returns the <mxGeometry> that describes the <geometry>.
     */
    getGeometry(): mxGeometry;

    /**
     * Sets the <mxGeometry> to be used as the <geometry>.
     */
    setGeometry(geometry: mxGeometry): void;

    /**
     * Returns a string that describes the <style>.
     */
    getStyle(): string;

    /**
     * Sets the string to be used as the <style>.
     */
    setStyle(style: string): void;

    /**
     * Returns true if the cell is a vertex.
     */
    isVertex(): boolean;

    /**
     * Specifies if the cell is a vertex. This should only be assigned at
     * construction of the cell and not be changed during its lifecycle.
     *
     * Parameters:
     *
     * @param vertex Boolean that specifies if the cell is a vertex.
     */
    setVertex(vertex: boolean): void;

    /**
     * Returns true if the cell is an edge.
     */
    isEdge(): boolean;

    /**
     * Specifies if the cell is an edge. This should only be assigned at
     * construction of the cell and not be changed during its lifecycle.
     *
     * Parameters:
     *
     * @param edge Boolean that specifies if the cell is an edge.
     */
    setEdge(edge: boolean): void;

    /**
     * Returns true if the cell is connectable.
     */
    isConnectable(): boolean;

    /**
     * Sets the connectable state.
     *
     * Parameters:
     *
     * @param connectable Boolean that specifies the new connectable state.
     */
    setConnectable(connectable: boolean): void;

    /**
     * Returns true if the cell is visibile.
     */
    isVisible(): boolean;

    /**
     * Specifies if the cell is visible.
     *
     * Parameters:
     *
     * @param visible Boolean that specifies the new visible state.
     */
    setVisible(visible: boolean): void;

    /**
     * Returns true if the cell is collapsed.
     */
    isCollapsed(): boolean;

    /**
     * Sets the collapsed state.
     *
     * Parameters:
     *
     * @param collapsed Boolean that specifies the new collapsed state.
     */
    setCollapsed(collapsed: boolean): void;

    /**
     * Returns the cell's parent.
     */
    getParent(): mxCell;

    /**
     * Sets the parent cell.
     *
     * Parameters:
     *
     * @param parent<mxCell> that represents the new parent.
     */
    setParent(parent: mxCell): void;

    /**
     * Returns the source or target terminal.
     *
     * Parameters:
     *
     * @param source Boolean that specifies if the source terminal should be
     * returned.
     */
    getTerminal(source: boolean): mxCell;

    /**
     * Sets the source or target terminal and returns the new terminal.
     *
     * @param {mxCell} terminal     mxCell that represents the new source or target terminal.
     * @param {boolean} isSource  boolean that specifies if the source or target terminal
     * should be set.
     */
    setTerminal(terminal: mxCell, isSource: boolean): mxCell;

    /**
     * Returns the number of child cells.
     */
    getChildCount(): number;

    /**
     * Returns the index of the specified child in the child array.
     *
     * Parameters:
     *
     * @param childChild whose index should be returned.
     */
    getIndex(child: mxCell): number;

    /**
     * Returns the child at the specified index.
     *
     * Parameters:
     *
     * @param indexInteger that specifies the child to be returned.
     */
    getChildAt(index: number): mxCell;

    /**
     * Inserts the specified child into the child array at the specified index
     * and updates the parent reference of the child. If not childIndex is
     * specified then the child is appended to the child array. Returns the
     * inserted child.
     *
     * Parameters:
     *
     * @param child<mxCell> to be inserted or appended to the child array.
     * @param indexOptional integer that specifies the index at which the child
     * should be inserted into the child array.
     */
    insert(child: mxCell, index: number): mxCell;

    /**
     * Removes the child at the specified index from the child array and
     * returns the child that was removed. Will remove the parent reference of
     * the child.
     *
     * Parameters:
     *
     * @param indexInteger that specifies the index of the child to be
     * removed.
     */
    remove(index: number): mxCell;

    /**
     * Removes the cell from its parent.
     */
    removeFromParent(): mxCell;

    /**
     * Returns the number of edges in the edge array.
     */
    getEdgeCount(): number;

    /**
     * Returns the index of the specified edge in <edges>.
     *
     * Parameters:
     *
     * @param edge<mxCell> whose index in <edges> should be returned.
     */
    getEdgeIndex(edge: mxCell): number;

    /**
     * Returns the edge at the specified index in <edges>.
     *
     * Parameters:
     *
     * @param indexInteger that specifies the index of the edge to be returned.
     */
    getEdgeAt(index: number): mxCell;

    /**
     * Inserts the specified edge into the edge array and returns the edge.
     * Will update the respective terminal reference of the edge.
     *
     * Parameters:
     *
     * @param edge              <mxCell> to be inserted into the edge array.
     * @param isOutgoing Boolean that specifies if the edge is outgoing.
     */
    insertEdge(edge: mxCell, isOutgoing: boolean): mxCell;

    /**
     * Removes the specified edge from the edge array and returns the edge.
     * Will remove the respective terminal reference from the edge.
     *
     * Parameters:
     *
     * @param edge<mxCell> to be removed from the edge array.
     * @param isOutgoing Boolean that specifies if the edge is outgoing.
     */
    removeEdge(edge: mxCell, isOutgoing: boolean): mxCell;

    /**
     * Removes the edge from its source or target terminal.
     *
     * Parameters:
     *
     * @param isSource Boolean that specifies if the edge should be removed from its source or target terminal.
     */
    removeFromTerminal(isSource: boolean): mxCell;

    /**
     * Returns true if the user object is an XML node that contains the given
     * attribute.
     *
     * Parameters:
     *
     * @param nameName nameName of the attribute.
     */
    hasAttribute(name: string): boolean;

    /**
     * Returns the specified attribute from the user object if it is an XML
     * node.
     *
     * Parameters:
     *
     * @param nameName              of the attribute whose value should be returned.
     * @param defaultValueOptional  default value to use if the attribute has no
     * value.
     */
    getAttribute(name: string, defaultValue: any): any;

    /**
     * Sets the specified attribute on the user object if it is an XML node.
     *
     * Parameters:
     *
     * @param nameName    of the attribute whose value should be set.
     * @param valueNew    value of the attribute.
     */
    setAttribute(name: string, value: any): void;

    /**
     * Returns a clone of the cell. Uses <cloneValue> to clone
     * the user object. All fields in <mxTransient> are ignored
     * during the cloning.
     */
    clone(): mxCell;

    /**
     * Returns a clone of the cell's user object.
     */
    cloneValue(): any;

    [key: string]: any;
  }
}
