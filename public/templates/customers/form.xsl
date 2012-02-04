<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:apply-templates select="proto-demo-customer"/>
  </xsl:template>

  <xsl:template match="proto-demo-customer">
    <xsl:variable name="errs" select="errors"/>
    <form class="fx-form fx-rounded-bottom fx-two-column-form" action="javascript:void(0);">
      <xsl:attribute name="action">customers/<xsl:value-of select="id"/></xsl:attribute>
      <xsl:attribute name="method">
        <xsl:choose>
          <xsl:when test="id != ''">put</xsl:when>
          <xsl:otherwise>post</xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <fieldset>
        <legend class="fx-rounded-bottom">
          <img src="images/person.png"/> Customer
          <xsl:if test="$errs"><img src="images/exclamation.png"/></xsl:if>
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
      <fieldset class="fx-control-bar">
        <xsl:element name="button">
          <xsl:attribute name="class">
            <xsl:choose>
              <xsl:when test="id != ''">fx-update</xsl:when>
              <xsl:otherwise>fx-add</xsl:otherwise>
            </xsl:choose>
          </xsl:attribute>
          <img src="images/save.png"/>
          <xsl:choose>
            <xsl:when test="id != ''"> Save</xsl:when>
            <xsl:otherwise> Add</xsl:otherwise>

            <!-- TODO Find a 16x16 animated 'wait' gif and determine how to use it
            <xsl:otherwise><img src="images/wait.gif"/> Add</xsl:otherwise>
                      -->

          </xsl:choose>
        </xsl:element>
        <button class="fx-cancel"><img src="images/close.png"/> Cancel</button>
        <xsl:if test="id != ''">
          <button class="fx-remove"><img src="images/remove.png"/> Remove</button>
        </xsl:if>
      </fieldset>
    </form>
  </xsl:template>

  <xsl:template match="first-name">
    <xsl:variable name="err" select="errors"/>
    <input id="first_name" name="first_name">
<!--
      <xsl:attribute name="class">fx-required<xsl:if test="$err"> fx-invalid</xsl:if></xsl:attribute>
-->
      <xsl:attribute name="value"><xsl:value-of select="text()"/></xsl:attribute>
    </input>
  </xsl:template>

  <xsl:template match="last-name">
    <xsl:variable name="err" select="errors"/>
    <input id="last_name" name="last_name">
<!--
      <xsl:attribute name="class">fx-required<xsl:if test="$err"> fx-invalid</xsl:if></xsl:attribute>
-->
      <xsl:attribute name="value"><xsl:value-of select="text()"/></xsl:attribute>
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