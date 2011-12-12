<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="customer"/>
  </xsl:template>

  <xsl:template match="customer">
    <xsl:variable name="identifier" select="id"/>
    <form class="fx-form fx-rounded-bottom fx-two-column-form" action="javascript:void(0);">
      <input type="hidden" name="resource">
        <xsl:attribute name="value">customers/<xsl:value-of select="id"/></xsl:attribute>
      </input>
      <fieldset>
        <legend class="fx-rounded-bottom">
          <img src="images/person.png"/> Customer
        </legend>
        <xsl:apply-templates select="errors"/>
        <ol>
          <li>
            <label for="first_name">First Name</label>
            <input id="first_name" name="customer[first_name]" class="fx-edit">
              <xsl:attribute name="value"><xsl:value-of select="first-name"/></xsl:attribute>
              <xsl:attribute name="disabled"/>
            </input>
          </li>
          <li>
            <label for="last_name">Last Name</label>
            <input id="last_name" name="customer[last_name]" class="fx-edit">
              <xsl:attribute name="value"><xsl:value-of select="last-name"/></xsl:attribute>
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