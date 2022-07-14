declare module 'mxgraph' {
  /**
   * @class mxGeometry
   *
   * @extends {mxRectangle}
   *
   * For vertices, the geometry consists of the x- and y-location, and the width
   * and height. For edges, the geometry consists of the optional terminal- and
   * control points. The terminal points are only required if an edge is
   * unconnected, and are stored in the {@link sourcePoint} and {@link targetPoint}
   * variables, respectively.
   *
   * ### Example
   *
   * If an edge is unconnected, that is, it has no source or target terminal,
   * then a geometry with terminal points for a new edge can be defined as
   * follows.
   *
   * ```javascript
   * geometry.setTerminalPoint(new mxPoint(x1, y1), true);
   * geometry.points: [new mxPoint(x2, y2)];
   * geometry.setTerminalPoint(new mxPoint(x3, y3), false);
   * ```
   *
   * Control points are used regardless of the connected state of an edge and may
   * be ignored or interpreted differently depending on the edge's {@link mxEdgeStyle}.
   *
   * To disable automatic reset of control points after a cell has been moved or
   * resized, the the {@link mxGraph.resizeEdgesOnMove} and
   * {@link mxGraph.resetEdgesOnResize} may be used.
   *
   * ### Edge Labels
   *
   * Using the x- and y-coordinates of a cell's geometry, it is possible to
   * position the label on edges on a specific location on the actual edge shape
   * as it appears on the screen. The x-coordinate of an edge's geometry is used
   * to describe the distance from the center of the edge from -1 to 1 with 0
   * being the center of the edge and the default value. The y-coordinate of an
   * edge's geometry is used to describe the absolute, orthogonal distance in
   * pixels from that point. In addition, the {@link mxGeometry.offset} is used as an
   * absolute offset vector from the resulting point.
   *
   * This coordinate system is applied if {@link relative} is true, otherwise the
   * offset defines the absolute vector from the edge's center point to the
   * label and the values for {@link x} and {@link y} are ignored.
   *
   * The width and height parameter for edge geometries can be used to set the
   * label width and height (eg. for word wrapping).
   *
   * ### Ports
   *
   * The term "port" refers to a relatively positioned, connectable child cell,
   * which is used to specify the connection between the parent and another cell
   * in the graph. Ports are typically modeled as vertices with relative
   * geometries.
   *
   * ### Offsets
   *
   * The {@link offset} field is interpreted in 3 different ways, depending on the cell
   * and the geometry. For edges, the offset defines the absolute offset for the
   * edge label. For relative geometries, the offset defines the absolute offset
   * for the origin (top, left corner) of the vertex, otherwise the offset
   * defines the absolute offset for the label inside the vertex or group.
   */

  class mxGeometry extends mxRectangle {
    constructor(x?: number, y?: number, width?: number, height?: number);

    /**
     * Global switch to translate the points in translate. Default is true.
     */
    TRANSLATE_CONTROL_POINTS: boolean;

    /**
     * Stores alternate values for x, y, width and height in a rectangle.
     * See {@link swap} to exchange the values. Default is null.
     *
     * @see {@link swap}
     */
    alternateBounds: mxRectangle;

    /**
     * Defines the source {@link mxPoint} of the edge. This is used if the
     * corresponding edge does not have a source vertex. Otherwise it is
     * ignored. Default is  null.
     */
    sourcePoint: mxPoint;

    /**
     * Defines the target {@link mxPoint} of the edge. This is used if the
     * corresponding edge does not have a target vertex. Otherwise it is
     * ignored. Default is null.
     */
    targetPoint: mxPoint;

    /**
     * Array of {@link mxPoints} which specifies the control points along the edge.
     * These points are the intermediate points on the edge, for the endpoints
     * use {@link targetPoint} and {@link sourcePoint} or set the terminals of the edge to
     * a non-null value. Default is null.
     */
    points: Array<mxPoint>;

    /**
     * For edges, this holds the offset (in pixels) from the position defined
     * by {@link x} and {@link y} on the edge. For relative geometries (for vertices), this
     * defines the absolute offset from the point defined by the relative
     * coordinates. For absolute geometries (for vertices), this defines the
     * offset for the label. Default is null.
     */
    offset: mxPoint;

    /**
     * Specifies if the coordinates in the geometry are to be interpreted as
     * relative coordinates. For edges, this is used to define the location of
     * the edge label relative to the edge as rendered on the display. For
     * vertices, this specifies the relative location inside the bounds of the
     * parent cell.
     *
     * If this is false, then the coordinates are relative to the origin of the
     * parent cell or, for edges, the edge label position is relative to the
     * center of the edge as rendered on screen.
     *
     * Default is false.
     */
    relative: boolean;

    setRelative(relative: boolean): void;

    /**
     * Swaps the x, y, width and height with the values stored in
     * {@link alternateBounds} and puts the previous values into {@link alternateBounds} as
     * a rectangle. This operation is carried-out in-place, that is, using the
     * existing geometry instance. If this operation is called during a graph
     * model transactional change, then the geometry should be cloned before
     * calling this method and setting the geometry of the cell using
     * {@link mxGraphModel.setGeometry}.
     */
    swap(): void;

    /**
     * Returns the {@link mxPoint} representing the source or target point of this
     * edge. This is only used if the edge has no source or target vertex.
     *
     * @param {Boolean} isSource that specifies if the source or target point should be returned.
     */
    getTerminalPoint(isSource: boolean): mxPoint;

    /**
     * Sets the {@link sourcePoint} or {@link targetPoint} to the given {@link mxPoint} and
     * returns the new point.
     *
     * @param {Point} point to be used as the new source or target point.
     * @param {Boolean} isSource that specifies if the source or target point should be set.
     */
    setTerminalPoint(point: mxPoint, isSource: boolean): mxPoint;

    /**
     * Rotates the geometry by the given angle around the given center. That is,
     * {@link x} and {@link y} of the geometry, the {@link sourcePoint}, {@link targetPoint} and all
     * {@link points} are translated by the given amount. {@link x} and {@link y} are only
     * translated if {@link relative} is false.
     *
     * @param {Number} angle that specifies the rotation angle in degrees.
     * @param {mxPoint} cx   that specifies the center of the rotation.
     */
    rotate(angle: number, cx: mxPoint): void;

    /**
     * Translates the geometry by the specified amount. That is, {@link x} and {@link y} of the
     * geometry, the {@link sourcePoint}, {@link targetPoint} and all {@link points} are translated
     * by the given amount. {@link x} and {@link y} are only translated if {@link relative} is false.
     * If {@link TRANSLATE_CONTROL_POINTS} is false, then {@link points} are not modified by
     * this function.
     *
     * @param {Number} dx that specifies the x-coordinate of the translation.
     * @param {Number} dy that specifies the y-coordinate of the translation.
     */
    translate(dx: number, dy: number): void;

    /**
     * Scales the geometry by the given amount. That is, {@link x} and {@link y} of the
     * geometry, the {@link sourcePoint}, {@link targetPoint} and all {@link points} are scaled
     * by the given amount. {@link x}, {@link y}, {@link width} and {@link height} are only scaled if
     * {@link relative} is false. If {@link fixedAspect} is true, then the smaller value
     * is used to scale the width and the height.
     *
     * @param {Number} sx that specifies the horizontal scale factor.
     * @param {Number} sy that specifies the vertical scale factor.
     * @param {Optional} fixedAspect boolean to keep the aspect ratio fixed.
     */
    scale(sx: number, sy: number, fixedAspect: boolean): void;

    /**
     * Returns true if the given object equals this geometry.
     */
    equals(obj: mxGeometry): boolean;

    clone(): mxGeometry;
  }
}
