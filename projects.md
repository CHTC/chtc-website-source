---
layout: content
title: Projects Using the CHTC
---

<div class="uw-row-full">
	<div class="uw-row">
		<div class="uw-col uw-body">
            <figure class="uw-float-right uw-float-50">
                <div class="table-container">
                    <table>
                    <tr><th>CHTC Quick Facts</th><th>Jul'10-Jun'11</th><th>Jul'11-Jun'12</th><th>Jul'12-Jun'13</th></tr>
                    <tr><td>Million Hours Served</td><td>45</td><td>70</td><td>97</td></tr>
                    <tr><td>Research Projects</td><td>54</td><td>106</td><td>126</td></tr>
                    <tr><td>Departments</td><td>35</td><td>52</td><td>52</td></tr>
                    <tr><td>Off-Campus</td><td>10</td><td>13</td><td>15</td></tr>
                    </table>
                </div>
            </figure>
            <p>
                Many researchers are currently using the CHTC for computational tasks.
                Here are descriptions of some of the researchers and research groups
                at the University of Wisconsin that work closely with the CHTC.
                <a href="{{ '/map' | relative_url }}">See where CHTC users are located on campus</a>.
            </p>
		</div>
	</div>
</div>
<div class="uw-row-full uw-light-grer-bg">
{% for project_hash in site.data.projects %}
    {% assign project = project_hash[1] %}
    {% include /components/project-row.html %}
{% endfor %}
</div>
            