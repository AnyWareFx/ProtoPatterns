<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="product-features">
    <table class="fx-rounded-bottom">
      <caption class="fx-rounded-top"><img src="images/products.png"/> Features</caption>
      <thead>
        <tr>
          <th class="fx-actions">
            <a href="product_features/new">
              <img src="images/add.png"
                   alt="Add Feature" title="Add Feature" class="fx-create"/>
            </a>
          </th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <xsl:apply-templates select="product-feature"/>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="fx-control-bar">Pagination Controls Go Here</td>
        </tr>
      </tfoot>
    </table>
  </xsl:template>

  <xsl:template match="product-feature">
    <xsl:element name="tr">
      <xsl:attribute name="class">
        <xsl:choose>
          <xsl:when test="position() mod 2 = 0">fx-even fx-selectable</xsl:when>
          <xsl:when test="position() mod 2 = 1">fx-odd fx-selectable</xsl:when>
        </xsl:choose>
      </xsl:attribute>
      <th>
        <xsl:element name="a">
          <xsl:attribute name="href">product_features/<xsl:value-of select="id"/></xsl:attribute>
          <img src="images/remove.png" alt="Remove Feature" title="Remove Feature" class="fx-remove"/>
        </xsl:element>
      </th>
      <td>
        <xsl:value-of select="name"/>
      </td>
      <td>
        <xsl:value-of select="description"/>
      </td>
    </xsl:element>
  </xsl:template>
</xsl:stylesheet>