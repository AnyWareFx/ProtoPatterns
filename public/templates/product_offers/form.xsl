<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="proto-demo-product-offer"/>
  </xsl:template>

  <xsl:template match="proto-demo-product-offer">
    <xsl:variable name="identifier" select="id"/>
    <xsl:variable name="errs" select="errors"/>
    <form class="fx-rounded-bottom fx-two-column-form" action="javascript:void(0);">
      <xsl:attribute name="method">
        <xsl:choose>
          <xsl:when test="$identifier">put</xsl:when>
          <xsl:otherwise>post</xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <input type="hidden" name="resource">
        <xsl:attribute name="value">product_offers/<xsl:value-of select="id"/></xsl:attribute>
      </input>
      <fieldset>
        <legend class="fx-rounded-bottom">
          <img src="images/product.png"/> Product Offer
          <xsl:if test="$errs"><img src="images/exclamation.png"/></xsl:if>
        </legend>
        <xsl:apply-templates select="errors"/>
        <ol>
          <li>
            <label for="name">Product</label>
            <input id="name">
              <xsl:attribute name="disabled">true</xsl:attribute>
              <xsl:attribute name="value"><xsl:value-of select="product/name"/></xsl:attribute>
            </input>
          </li>
          <li>
            <label for="description">Description</label>
            <textarea id="description">
              <xsl:attribute name="disabled">true</xsl:attribute>
              <xsl:value-of select="product/description"/>
            </textarea>
          </li>
          <li>
            <label for="units">Units</label>
            <xsl:apply-templates select="units"/>
          </li>
          <li>
            <label for="unit-price">Unit Price</label>
            <xsl:apply-templates select="unit-price"/>
          </li>
        </ol>
      </fieldset>
      <fieldset class="fx-control-bar">
        <xsl:element name="button">
          <xsl:attribute name="class">
            <xsl:choose>
              <xsl:when test="$identifier">fx-update</xsl:when>
              <xsl:otherwise>fx-add</xsl:otherwise>
            </xsl:choose>
          </xsl:attribute>
          <img src="images/save.png"/>
          <xsl:choose>
            <xsl:when test="$identifier"> Save</xsl:when>
            <xsl:otherwise> Add</xsl:otherwise>

            <!-- TODO Find a 16x16 animated 'wait' gif and determine how to use it
            <xsl:otherwise><img src="images/wait.gif"/> Add</xsl:otherwise>
                      -->

          </xsl:choose>
        </xsl:element>
        <button class="fx-cancel"><img src="images/close.png"/> Cancel</button>
        <xsl:if test="$identifier">
          <button class="fx-remove"><img src="images/remove.png"/> Remove</button>
        </xsl:if>
      </fieldset>
    </form>
  </xsl:template>

  <xsl:template match="units">
    <xsl:variable name="err" select="errors"/>
    <input id="units" name="product_offer[units]">
      <xsl:attribute name="value"><xsl:value-of select="text()"/></xsl:attribute>
      <xsl:attribute name="class">fx-required<xsl:if test="$err"> fx-invalid</xsl:if></xsl:attribute>
    </input>
  </xsl:template>

  <xsl:template match="unit-price">
    <xsl:variable name="err" select="errors"/>
    <input id="unit_price" name="product_offer[unit_price]">
      <xsl:attribute name="value"><xsl:value-of select="text()"/></xsl:attribute>
      <xsl:attribute name="class">fx-required<xsl:if test="$err"> fx-invalid</xsl:if></xsl:attribute>
    </input>
  </xsl:template>

  <xsl:template match="errors">
    <ul class="fx-error-list fx-rounded-top">
      <xsl:apply-templates select="error"/>
    </ul>
  </xsl:template>

  <xsl:template match="error">
    <li>
      <xsl:value-of select="."/>
    </li>
  </xsl:template>

</xsl:stylesheet>