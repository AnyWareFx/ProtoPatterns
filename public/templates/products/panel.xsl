<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="product"/>
  </xsl:template>

  <xsl:template match="product">
    <xsl:variable name="identifier" select="id"/>
    <xsl:variable name="errs" select="errors"/>
    <form class="fx-rounded-bottom fx-two-column-form" action="javascript:void(0);">
      <input type="hidden" name="resource">
        <xsl:attribute name="value">products/<xsl:value-of select="id"/></xsl:attribute>
      </input>
      <fieldset>
        <legend class="fx-rounded-bottom">
          <img src="images/product.png"/> Product
          <xsl:if test="$errs"><img src="images/exclamation.png"/></xsl:if>
        </legend>
        <xsl:apply-templates select="errors"/>
        <ol>
          <li>
            <label for="name">Name</label>
            <input id="name" name="product[name]">
              <xsl:attribute name="value"><xsl:value-of select="name"/></xsl:attribute>
              <xsl:attribute name="disabled"/>
            </input>
          </li>
          <li>
            <label for="description">Description</label>
            <textarea id="description" name="product[description]">
              <xsl:attribute name="disabled"/>
              <xsl:value-of select="description"/>
            </textarea>
          </li>
          <li>
            <label for="unit-cost">Unit Cost</label>
            <input id="unit_cost" name="product[unit_cost]">
              <xsl:attribute name="value"><xsl:value-of select="unit-cost"/></xsl:attribute>
              <xsl:attribute name="disabled"/>
            </input>
          </li>
        </ol>
      </fieldset>
      <xsl:if test="$identifier">
        <fieldset class="fx-control-bar">
          <button class="fx-edit"><img src="images/edit.png"/> Edit</button>
        </fieldset>
      </xsl:if>
    </form>
  </xsl:template>

</xsl:stylesheet>