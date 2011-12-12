<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="customer"/>
  </xsl:template>

  <xsl:template match="customer">
    <form class="fx-form fx-rounded-bottom fx-two-column-form" action="javascript:void(0);">
      <fieldset>
        <legend class="fx-rounded-bottom">
          <img src="images/person.png"/> Customer
        </legend>
        <xsl:apply-templates select="errors"/>
        <ol>
          <li>
            <label for="first_name">First Name</label>
            <xsl:apply-templates select="first-name"/>
          </li>
          <li>
            <label for="last_name">Last Name</label>
            <xsl:apply-templates select="last-name"/>
          </li>
        </ol>
      </fieldset>
    </form>
  </xsl:template>

  <xsl:template match="first-name">
    <xsl:element name="input">
      <xsl:attribute name="id">first_name</xsl:attribute>
      <xsl:attribute name="name">customer[first_name]</xsl:attribute>
      <xsl:attribute name="value">
        <xsl:value-of select="text()"/>
      </xsl:attribute>
      <xsl:attribute name="class">fx-required</xsl:attribute>
    </xsl:element>
  </xsl:template>

  <xsl:template match="last-name">
    <xsl:element name="input">
      <xsl:attribute name="id">last_name</xsl:attribute>
      <xsl:attribute name="name">customer[last_name]</xsl:attribute>
      <xsl:attribute name="value">
        <xsl:value-of select="text()"/>
      </xsl:attribute>
      <xsl:attribute name="class">fx-required</xsl:attribute>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>