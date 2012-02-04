<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="proto-demo-shopping-cart-items">
    <table class="fx-rounded-bottom">
      <caption class="fx-rounded-top"><img src="images/cart.png"/> Shopping Cart Items</caption>
      <thead>
        <tr>
          <th class="fx-actions"> </th>
          <th>Name</th>
          <th>Units</th>
          <th>Unit Price</th>
          <th>Item Total</th>
        </tr>
      </thead>
      <tbody>
        <xsl:apply-templates select="proto-demo-shopping-cart-item"/>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="fx-control-bar">Pagination Controls Go Here</td>
        </tr>
      </tfoot>
    </table>
  </xsl:template>

  <xsl:template match="proto-demo-shopping-cart-item">
    <xsl:element name="tr">
      <xsl:attribute name="class">
        <xsl:choose>
          <xsl:when test="position() mod 2 = 0">fx-even fx-selectable</xsl:when>
          <xsl:when test="position() mod 2 = 1">fx-odd fx-selectable</xsl:when>
        </xsl:choose>
      </xsl:attribute>
      <th>
        <xsl:element name="a">
          <xsl:attribute name="href">shopping_cart_items/<xsl:value-of select="id"/></xsl:attribute>
          <img src="images/remove.png" alt="Remove Product" title="Remove Product" class="fx-remove"/>
        </xsl:element>
      </th>
      <td>
        <xsl:value-of select="offer/name"/>
      </td>
      <td>
        <xsl:value-of select="units"/>
      </td>
      <td>
        <xsl:value-of select="offer/unit-price"/>
      </td>
      <td>
        <xsl:value-of select="item-total"/>
      </td>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>